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

exports.registerUser = async (organization, userId, obj) => {
    console.log(obj.patientId);
    let wallet1;
    let wallet2 = '';
    try{
        if(organization === 'doctor'){
            ccp = buildCCDoctor();
            caClient = buildCAClient(FabricCAServices, ccp, 'ca.doctor.hospital_network.com');
            if(obj.role === 'patient'){
                
                userId = obj.patientId;

                walletPath = path.join(__dirname, 'wallet/doctor');
                wallet1 = await buildWallet(Wallets, walletPath);
                
                walletPath = path.join(__dirname, 'wallet/patient');
                wallet2 = await buildWallet(Wallets, walletPath);
            
            }else{
                walletPath = path.join(__dirname, 'wallet/doctor');
                wallet1 = await buildWallet(Wallets, walletPath);
            }
        
            adminUserId = 'doctoradmin';
            orgMSP = 'DoctorMSP';
            const respose = await registerAndEnrollUser(caClient, wallet1, orgMSP, userId, adminUserId, JSON.stringify(obj), wallet2);
        }else if(organization === 'laboratory'){
            ccp = buildCCLaboratory();
            caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.hospital_network.com');
            walletPath = path.join(__dirname, 'wallet/laboratory');
            wallet = await buildWallet(Wallets, walletPath);
            adminUserId = 'laboratoryadmin';
            orgMSP = 'LaboratoryMSP';
        }
        
    }catch(err){
        console.error(`Failed to register user "${userId}": ${error}`);
        process.exit(1);
    }
}

//registerUser('doctor', 'D01', {firstName: 'Sushant', lastName: 'Barje', role: 'doctor', speciality: 'heart'});