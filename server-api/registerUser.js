/*
* Copyright IBM Corp. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { buildWallet, buildCCDoctor, buildCCLaboratory } = require('./utils/AppUtils');
const { buildCAClient, registerAndEnrollUser } = require('./utils/CAUtils');

let ccp;
let caClient;
let orgMSP;
let adminUserId;
let walletPath;
let wallet;

const registerUser = async (organization, userid, obj) => {
    try{
        if(organization === 'doctor'){
            ccp = buildCCDoctor();
            caClient = buildCAClient(FabricCAServices, ccp, 'ca.doctor.hospital_network.com');
            if(obj.role === 'patient'){
                walletPath = path.join(__dirname, 'wallet/patient');
            }else{
                walletPath = path.join(__dirname, 'wallet/doctor');
            }
            wallet = await buildWallet(Wallets, walletPath);
            adminUserId = 'doctoradmin';
            orgMSP = 'doctorMSP';
        }else if(organization === 'laboratory'){
            ccp = buildCCLaboratory();
            caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.hospital_network.com');
            walletPath = path.join(__dirname, 'wallet/laboratory');
            wallet = await buildWallet(Wallets, walletPath);
            adminUserId = 'laboratoryadmin';
            orgMSP = 'laboratoryMSP';
        }
        const respose = await registerAndEnrollUser(caClient, wallet, orgMSP, userid, adminUserId, JSON.stringify(obj));
    }catch(err){
        console.error(`Failed to register user "${userId}": ${error}`);
        process.exit(1);
    }
}

//registerUser('doctor', 'D01', {firstName: 'Sushant', lastName: 'Barje', role: 'doctor', speciality: 'heart'});