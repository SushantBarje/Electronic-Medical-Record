/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AdminContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
    }

    
}

module.exports = AdminContract;
