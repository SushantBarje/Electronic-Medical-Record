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
let userId;

exports.registerUser = async (organization, adminUserId, obj) => {
    console.log(obj.patientId);
    console.log(organization);
    try{
        if(organization === 'doctor'){
            ccp = buildCCDoctor();
            caClient = buildCAClient(FabricCAServices, ccp, 'ca.doctor.hospital_network.com');
            walletPath = path.join(__dirname, 'wallet');
            console.log(walletPath);
            wallet = await buildWallet(Wallets, walletPath);
            userId = obj.patientId;
            // if(obj.role === 'patient'){
                
            //     

            //     walletPath = path.join(__dirname, 'wallet/doctor');
            //     wallet1 = await buildWallet(Wallets, walletPath);
                
                
            
            // }else{
            //     walletPath = path.join(__dirname, 'wallet/doctor');
            //     wallet1 = await buildWallet(Wallets, walletPath);
            // }
        
            orgMSP = 'DoctorMSP';
            console.log("admin" + adminUserId);
            const response = await registerAndEnrollUser(caClient, wallet, orgMSP, userId, adminUserId, JSON.stringify(obj));
            console.log(response)
        }else if(organization === 'laboratory'){
            ccp = buildCCLaboratory();
            caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.hospital_network.com');
            walletPath = path.join(__dirname, 'wallet/laboratory');
            wallet = await buildWallet(Wallets, walletPath);
            adminUserId = 'laboratoryadmin';
            orgMSP = 'LaboratoryMSP';
        }
        
    }catch(error){
        console.error(`Failed to register user "${userId}": ${error}`);
        process.exit(1);
    }
}

//registerUser('doctor', 'D01', {firstName: 'Sushant', lastName: 'Barje', role: 'doctor', speciality: 'heart'});