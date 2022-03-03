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
    await validateRole(PATIENT_ROLE, req.user.role, res);
    if (req.params.organization === "" || req.params.organization.length === 0 || req.params.organization !== req.user.org) {
        res.status(400).json({ error: 'noOrg', message: 'Organization not found' });
    }

    const networkObj = await connectNetwork(req.user.username, req.params.organization, 'patient');
    const users = networkObj.gateway.identityContext.user;
    console.log(users);
    let caClient;
    if (req.params.organization === 'doctor') {
        const ccp = buildCCDoctor();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.doctor.hospital_network.com');
    } else if (req.params.organization === 'laboratory') {
        const ccp = buildCCLaboratory();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.hospital_network.com');
    }


    const idService = caClient.newIdentityService();
    console.log(idService);
    const userList = await idService.getAll(users);
    console.log(userList);
    //console.log(caClient);
    //console.log(await caClient.newIdentityService().getAll(users));
    //const identitiesArray = await caClient.newIdentityService().getAll(users);
    // const identities = identitiesArray.result.identities;

    // const result = [];

    // for (let i = 0; i < identities.length; i++) {
    //     let temp = {};
    //     if (identities[i].type === 'client' && identities[i].id !== req.user.username && identities[i].id !== 'user1') {
    //         temp.id = identities[i].id;
    //         let attrs = identities[i].attrs;
    //         for (let j = 0; j < attrs.length; j++) {
    //             if (attrs[j].id !== req.user.username) {
    //                 if (attrs[j].name === 'firstName' || attrs[j].name === 'lastName' || attrs[j].name === 'role' || attrs[j].name === 'organization' || attrs[j].name === 'speciality') {
    //                     temp[attrs[j].name] = attrs[j].value;
    //                 }
    //             }
    //         }
    //         result.push(temp);
    //     }
    // }

    //res.status(200).json({ error: 'none', message: result });
});

router.patch('/doctors/grant/:doctor', auth.verify, async (req, res) => {
    await validateRole(PATIENT_ROLE, req.user.role, res);
    const doctorId = req.params.doctor;
    req.user.org = 'doctor';
    const network = await connectNetwork(req.user.username, req.user.org, 'patient');
    const patientId = req.user.username;

    let args = { patientId: patientId, doctorId: doctorId };
    const response = await network.contract.submitTransaction('PatientContract:grantAccess', [JSON.stringify(args)]);
    console.log(response.toString());
    res.status(200).json({ error: "none", message: "Access Given to " + doctorId });
});

router.patch('/doctors/remove/:doctor', auth.verify, async (req, res) => {
    await validateRole(PATIENT_ROLE, req.user.role, res);
    const doctorId = req.params.doctor;
    req.user.org = 'doctor';
    const network = await connectNetwork(req.user.username, req.user.org, 'patient');
    const patientId = req.user.username;

    let args = { patientId: patientId, doctorId: doctorId };
    const response = await network.contract.submitTransaction('PatientContract:revokeAccess', [JSON.stringify(args)]);
    console.log(response.toString());
    res.status(200).json({ error: "none", message: "Remove Access to " + doctorId });
});

router.get('/patient/record/all/history', auth.verify, async (req, res) => {
    await validateRole(PATIENT_ROLE, req.user.role, res);
    const patientId = req.user.username;
    const network = await connectNetwork(req.user.username, req.user.org, 'patient');

    const response = await network.contract.evaluateTransaction('PatientContract:getPatientHistory', patientId);
    console.log(response);
    res.json(await JSON.parse(response));
})

module.exports = router;