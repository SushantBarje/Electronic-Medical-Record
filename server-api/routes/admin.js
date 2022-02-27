var express = require('express');
var router = express.Router();
const { Gateway, Wallets } = require('fabric-network');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const { ADMIN_ROLE, DOCTOR_ROLE, validateRole, createRedisConnection, PATIENT_ROLE, connectNetwork } = require('../utils/utils');
const { buildWallet, buildCCDoctor, buildCCLaboratory } = require('../utils/AppUtils');
const { buildCAClient, registerAndEnrollUser } = require('../utils/CAUtils');
const FabricCAServices = require('fabric-ca-client');
const { registerUser } = require('../registerUser');

router.post('/doctors/register', auth.verify, async (req, res) => {
    await validateRole(ADMIN_ROLE, req.user.role, res);
    const { username, password } = req.body;

    const redisClient = await createRedisConnection(req.user.org);
    (await redisClient).SET(username, password);

    req.body.role = DOCTOR_ROLE;
    req.body.organization = req.user.org;
    const obj = [JSON.stringify(req.body)];
    let response;
    try {
        if (req.user.org === 'doctor') {
            const ccp = buildCCDoctor();
            const caClient = await buildCAClient(FabricCAServices, ccp, 'ca.doctor.hospital_network.com');
            const wallet = await buildWallet(Wallets, path.join(__dirname, '../wallet/doctor'));
            response = await registerAndEnrollUser(caClient, wallet, 'DoctorMSP', username, req.user.username, obj);

        } else if (req.user.org === 'laboratory') {
            const ccp = buildCCLaboratory();
            const caClient = await buildCAClient(FabricCAServices, ccp, 'ca.laboratory.hospital_network.com');
            const wallet = await buildWallet(Wallets, path.join(__dirname, '../wallet/laboratory'));
            response = await registerAndEnrollUser(caClient, wallet, 'LaboratoryMSP', username, req.user.username, obj);
        }

        if (response.error !== 'none') {
            res.status(400).json(response);
        } else {
            res.status(200).json(response);
        }
    } catch (err) {
        console.log(err);
        (await redisClient).DEL(username);
        res.status(400).json(err)
    }
});

/**
 * @param {req} Request contains header attributes for registration of patient.
 * @param {res} Response 200 for creating and storing patient 400 if something went wrong.  
 * @description Creates patient identities and add to wallet and ledger.
 */

router.post('/patient/register', auth.verify, async (req, res) => {

    try {
        await validateRole(ADMIN_ROLE, req.user.role, res);

        const network = await connectNetwork(req.user.username, req.user.org, 'doctor');

        let patientLastId = await network.contract.evaluateTransaction('AdminContract:getLastPatientId');
        console.log(parseInt(patientLastId.slice(3)));
        console.log(parseInt(patientLastId.slice(3)) + 1);
        patientId = 'PID' + (parseInt(patientLastId.slice(3)) + 1);
        console.log(patientId);
        req.body.patientId = patientId;
        req.body.password = Math.random().toString(36).slice(-8);
        req.body.updatedBy = req.user.username;
        req.body.role = 'patient';
        const response = await network.contract.submitTransaction('AdminContract:createPatient', JSON.stringify(req.body));
        console.log(response.toString());

        const result = await registerUser(req.user.org, req.user.username, req.body);

        if (response.error) {
            res.status(400).send(response.error);
        }
        console.log(`Transaction has been evaluated, result is: ${response}`);

        // Disconnect from the gateway.
        await network.gateway.disconnect();
        res.status(200).json({ error: 'none', message: 'Patient Registeration succesfull', username: req.body.patientId, password: req.body.password });
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
});

router.get('/doctors/all/:organization', auth.verify, async (req, res) => {
    await validateRole(ADMIN_ROLE, req.user.role, res);
    if (req.params.organization === "" || req.params.organization.length === 0 || req.params.organization !== req.user.org) {
        res.status(400).json({ error: 'noOrg', message: 'Organization not found' });
    }
    const networkObj = await connectNetwork(req.user.username, req.user.org);

    const users = networkObj.gateway.identityContext.user;
    
    let caClient
    if (req.params.organization === 'doctor') {
        const ccp = buildCCDoctor();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.doctor.hospital_network.com');
    } else if (req.params.organization === 'laboratory') {
        const ccp = buildCCLaboratory();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.hospital_network.com');
    }

    const identitiesArray = await caClient.newIdentityService().getAll(users);
    const identities = identitiesArray.result.identities;
    console.log(identities);
    const result = [];

    for (let i = 0; i < identities.length; i++) {
        let temp = {};
        if (identities[i].type === 'client' && identities[i].id !== req.user.username && identities[i].id !== 'user1' && identities[i].attrs[2].value !== 'patient') {
            temp.id = identities[i].id;
            let attrs = identities[i].attrs;

            for (let j = 0; j < attrs.length; j++) {
                if (attrs[j].id !== req.user.username) {
                    if (attrs[j].name === 'firstName' || attrs[j].name === 'lastName' || attrs[j].name === 'role' || attrs[j].name === 'organization' || attrs[j].name === 'speciality') {
                        temp[attrs[j].name] = attrs[j].value;
                    }
                }
            }
            result.push(temp);
        }
    }

    res.status(200).json({ error: 'none', message: result });
});

router.get('/patients/all/:organization', auth.verify, async (req, res) => {
    await validateRole(ADMIN_ROLE, req.user.role, res);
    try {
        const network = await connectNetwork(req.user.username, req.user.org);
        let result = await network.contract.evaluateTransaction('AdminContract:getAllPatient');
        result = JSON.parse(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }

});

// router.get('/', async (req, res) => {
//     try {
//         // load the network configuration
//         const ccpPath = path.resolve(__dirname, '..', '..', 'network-config', 'organizations', 'peerOrganizations', 'doctor.hospital_network.com', 'connection-doctor.json');
//         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const identity = await wallet.get('appUser1');
//         if (!identity) {
//             console.log('An identity for the user "appUser" does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }

//         // Create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('hospital');

//         // Get the contract from the network.
//         const contract = network.getContract('basic');

//         const result = await contract.evaluateTransaction('getPatient', 'PID1');
//         const data = JSON.parse(result);
//         console.log(`Transaction has been evaluated, result is: ${result}`);

//         // Disconnect from the gateway.
//         await gateway.disconnect();
//         return data;

//     } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         process.exit(1);
//     }
// });

// router.get('/getAllPatient', async (req, res) => {
//     try {
//         // load the network configuration
//         const ccpPath = path.resolve(__dirname, '..', '..', 'network-config', 'organizations', 'peerOrganizations', 'doctor.hospital_network.com', 'connection-doctor.json');
//         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const identity = await wallet.get('appUser1');
//         if (!identity) {
//             console.log('An identity for the user "appUser" does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }

//         // Create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('hospital');

//         //Get the contract from the network.
//         const contract = network.getContract('basic', 'PatientContract');

//         const result = await contract.evaluateTransaction('grantAccess',JSON.stringify({patientId:'PID2', doctorId:'DID0'}));
//         console.log('Transaction has been evaluated, result is:');
//         console.log(result);
//         // const contract = network.getContract('basic', 'org.hyperledger.fabric');
//         // const result = await contract.evaluateTransaction('GetMetadata');
//         // const metadata = JSON.parse(result);
//         // console.log(metadata.contracts);
//         // Disconnect from the gateway.
//         await gateway.disconnect();
//         //res.send(result.toString());

//     } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         process.exit(1);
//     }
// });

// router.get('/createPatient', async (req, res) => {
//     try {
//         // load the network configuration
//         const ccpPath = path.resolve(__dirname, '..', '..', 'network-config', 'organizations', 'peerOrganizations', 'doctor.hospital_network.com', 'connection-doctor.json');
//         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const identity = await wallet.get('appUser1');
//         if (!identity) {
//             console.log('An identity for the user "appUser" does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }

//         // Create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('hospital');

//         // Get the contract from the network.
//         const contract = network.getContract('basic', 'AdminContract');

//         let patientId = await contract.evaluateTransaction('getLastPatientId');
//         console.log(parseInt(patientId.slice(3)) + 1);
//         patientId = 'PID' + (parseInt(patientId.slice(3)) + 1);
//         console.log(patientId);

//         let patient = {
//             patientId: patientId,
//             firstName: 'Eleven',
//             middleName: 'Joe',
//             lastName: 'Sharma',
//             password: 'password1',
//             age: '22',
//             phoneNumber: '1234567890',
//             address: 'Pandharpur',
//             bloodGroup: 'O+ve',
//             updatedBy: 'appUser1',
//             other: 'no'
//         };

//         patient = JSON.stringify(patient);
//         const response = await contract.submitTransaction('createPatient', patient);
//         console.log(response);
//         if (response.error) {
//             res.status(400).send(response.error);
//         }
//         //console.log(`Transaction has been evaluated, result is: ${result}`);

//         // Disconnect from the gateway.
//         await gateway.disconnect();
//         res.send('ok done');
//     } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         process.exit(1);
//     }
// });

// router.post('/admin/login', (req, res) => {

// });

module.exports = router;