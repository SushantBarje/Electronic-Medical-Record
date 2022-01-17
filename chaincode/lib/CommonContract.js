/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
let Patient = require('./PatientAssets');

class CommanContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const initData = [
            {
                "firstName": "Sushant",
                "middleName": ".H.",
                "lastName": "Barje",
                "password": "d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1",
                "age": "16",
                "phoneNumber": "1234567890",
                "address": "Mumbai",
                "bloodGroup": "O+ve",
                "updatedBy": "initLedger",
                "symptoms": "fever",
                "diagnosis": "Covid",
                "treatment": "dolo 2 times",
                "other": "no",
            },
            {
                "firstName": "Five",
                "middleName": ".H.",
                "lastName": "Barje",
                "password": "d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1",
                "age": "16",
                "phoneNumber": "1234567890",
                "address": "Mumbai",
                "bloodGroup": "O+ve",
                "updatedBy": "initLedger",
                "symptoms": "fever",
                "diagnosis": "Covid",
                "treatment": "dolo 2 times",
                "other": "no",
            }
        ]

        for (let i = 0; i < initData.length; i++) {
            initData[i].docType = 'patient';
            await ctx.stub.putState('PID' + i, Buffer.from(JSON.stringify(initData[i])));
            console.log('Data Added:---', initData[i]);
        }
    }
}

module.exports = CommanContract;
