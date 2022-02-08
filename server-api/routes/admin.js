var express = require('express');
var router = express.Router();
const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'network-config', 'organizations', 'peerOrganizations', 'doctor.hospital_network.com', 'connection-doctor.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser1');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('hospital');

        // Get the contract from the network.
        const contract = network.getContract('basic');

        const result = await contract.evaluateTransaction('getPatient', 'PID1');
        const data = JSON.parse(result);
        console.log(`Transaction has been evaluated, result is: ${result}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        return data;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
});

router.get('/getAllPatient', async (req, res) => {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'network-config', 'organizations', 'peerOrganizations', 'doctor.hospital_network.com', 'connection-doctor.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser1');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('hospital');

        //Get the contract from the network.
        const contract = network.getContract('basic', 'PatientContract');

        const result = await contract.evaluateTransaction('getPatientHistory', 'PID0');
        const data = JSON.parse(result.toString());
        console.log('Transaction has been evaluated, result is:');
        console.log(data);
        // const contract = network.getContract('basic', 'org.hyperledger.fabric');
        // const result = await contract.evaluateTransaction('GetMetadata');
        // const metadata = JSON.parse(result);
        // console.log(metadata.contracts);
        // Disconnect from the gateway.
        await gateway.disconnect();
        res.send(data[0].patientId);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
});

router.get('/createPatient', async (req, res) => {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'network-config', 'organizations', 'peerOrganizations', 'doctor.hospital_network.com', 'connection-doctor.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser1');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('hospital');

        // Get the contract from the network.
        const contract = network.getContract('basic', 'AdminContract');

        let patientId = await contract.evaluateTransaction('getLastPatientId');
        console.log(parseInt(patientId.slice(3)) + 1);
        patientId = 'PID' + (parseInt(patientId.slice(3)) + 1);
        console.log(patientId);

        let patient = {
            patientId: patientId,
            firstName: 'Eleven',
            middleName: 'Joe',
            lastName: 'Sharma',
            password: 'password1',
            age: '22',
            phoneNumber: '1234567890',
            address: 'Pandharpur',
            bloodGroup: 'O+ve',
            updatedBy: 'appUser1',
            other: 'no'
        };

        patient = JSON.stringify(patient);
        const response = await contract.submitTransaction('createPatient', patient);
        console.log(response);
        if (response.error) {
            res.status(400).send(response.error);
        }
        //console.log(`Transaction has been evaluated, result is: ${result}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        res.send('ok done');
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
});

router.post('/admin/login', (req, res) => {

});

module.exports = router;