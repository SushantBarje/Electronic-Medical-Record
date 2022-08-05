var express = require('express');
var router = express.Router();
const { Gateway, Wallets } = require('fabric-network');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const { PATIENT_ROLE, validateRole, createRedisConnection, connectNetwork } = require('../utils/utils');
const { buildWallet, buildCCDoctor, buildCCLaboratory } = require('../utils/AppUtils');
const { buildCAClient } = require('../utils/CAUtils');
const FabricCAServices = require('fabric-ca-client');
const { createCluster } = require('redis');

router.get("/doctors/all/:organization", auth.verify, async (req, res) => {
    console.log(req.params);
    await validateRole(PATIENT_ROLE, req.user.role, res);
    
    if (req.params.organization === "" || req.params.organization.length === 0) {
        res.status(400).json({ error: 'noOrg', message: 'Organization not found' });
    }

    const userId = req.params.organization === 'doctor' ? 'doctoradmin' : 'laboratoryadmin';
    const networkObj = await connectNetwork(userId, req.params.organization);
    const users = networkObj.gateway.identityContext.user;

    let caClient;
    if (req.params.organization === 'doctor') {
        const ccp = buildCCDoctor();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.doctor.hospital_network.com');
    } else if (req.params.organization === 'laboratory') {
        const ccp = buildCCLaboratory();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.hospital_network.com');
    }

    const identitiesArray = await caClient.newIdentityService().getAll(users);

    const identities = identitiesArray.result.identities;

    const response = await networkObj.contract.evaluateTransaction('PatientContract:getPatient', req.user.username);
    let patientRecord = JSON.parse(response);
    const permissions = patientRecord.permissionGranted;

    const result = [];

    for (let i = 0; i < identities.length; i++) {
        let temp = {};
        if (identities[i].type === 'client' && identities[i].id !== req.user.username && identities[i].id !== 'user1' && identities[i].id !== 'doctoradmin') {
            temp.id = identities[i].id;
            let attrs = identities[i].attrs;
            let flag = 0;
            for (let j = 0; j < attrs.length; j++) {
                console.log(attrs[j].name);
                console.log(attrs[j].name === 'role');
                console.log(attrs[j].value);
                console.log(attrs[j].value !== 'patient');
                console.log("end");
                if (attrs[j].id !== req.user.username && (attrs[j].name === 'role' && attrs[j].value !== 'patient')) {
                    if (attrs[j].name === 'firstName' || attrs[j].name === 'lastName' || attrs[j].name === 'role' || attrs[j].name === 'organization' || attrs[j].name === 'speciality') {
                        temp[attrs[j].name] = attrs[j].value;
                        flag = 1;
                    }
                }
            }
            if(flag){
                if(permissions.includes(identities[i].id)){
                    temp.permissionGranted = 1;
                }else{
                    temp.permissionGranted = 0;
                }
                result.push(temp);
            }
        }
    }
    
    res.status(200).json({ error: 'none', message: result });
});

router.patch('/doctors/grant', auth.verify, async (req, res) => {
    await validateRole(PATIENT_ROLE, req.user.role, res);
    const doctorId = req.body.doctorId;
    req.user.org = 'doctor';
    const network = await connectNetwork(req.user.username, req.user.org, 'patient');
    const patientId = req.user.username;

    let args = { patientId: patientId, doctorId: doctorId };
    const response = await network.contract.submitTransaction('PatientContract:grantAccess', [JSON.stringify(args)]);
    console.log(response.toString());
    res.status(200).json({ error: "none", message: "Access Given to " + doctorId });
});

router.patch('/doctors/remove', auth.verify, async (req, res) => {
    await validateRole(PATIENT_ROLE, req.user.role, res);
    const doctorId = req.body.doctorId;
    req.user.org = 'doctor';
    const network = await connectNetwork(req.user.username, req.user.org, 'patient');
    const patientId = req.user.username;

    let args = { patientId: patientId, doctorId: doctorId };
    const response = await network.contract.submitTransaction('PatientContract:revokeAccess', [JSON.stringify(args)]);
    console.log(response.toString());
    res.status(200).json({ error: "none", message: "Remove Access to " + doctorId });
});

router.get('/record/all/history', auth.verify, async (req, res) => {
    await validateRole(PATIENT_ROLE, req.user.role, res);
    const patientId = req.user.username;
    const network = await connectNetwork(req.user.username, req.user.org, 'patient');

    const response = await network.contract.evaluateTransaction('PatientContract:getPatientHistory', patientId); 
    const data = await JSON.parse(response);
    const datetime = new Date(data[0].timestamp.seconds*1000);

    let year = datetime.getFullYear();
    let month = ("0" + (datetime.getMonth() + 1)).slice(-2);
    let day = ("0" + datetime.getDate()).slice(-2);
    // let hour = datetime.getHours();
    // let minute = datetime.getMinutes();
    // let seconds = datetime.getSeconds();

    let date = day+"/"+month+"/"+year;
    let time = datetime.toLocaleTimeString();
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds);

    res.status(200).json({ error: "none", message: await JSON.parse(response) });
})

module.exports = router;