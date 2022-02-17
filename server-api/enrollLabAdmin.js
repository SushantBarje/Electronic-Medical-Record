/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { buildCCLaboratory, buildWallet } = require('./utils/AppUtils');
const { buildCAClient, enrollAdmin } = require('./utils/CAUtils');

const doctorMSPID = 'LaboratoryMSP';
const caHostName = 'ca.laboratory.hospital_network.com';
const labAdminUsername = 'admin';
const labAdminPassword = 'adminpw';
const walletPath = path.join(__dirname, 'wallet/laboratory');

exports.enrollLabAdmin = () => {
  try {
    // load the network configuration
    const ccp = buildCCLaboratory();

    // Create a new CA client for interacting with the CA.
    const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

    // Create a new file system based wallet for managing identities.
    const wallet = await buildWallet(Wallets, walletPath);

    // Check to see if we've already enrolled the admin user.
    await enrollAdmin(caClient, wallet, doctorMSPID, labAdminUsername, labAdminPassword);
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    process.exit(1);
  }
}
