/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CommonContract extends Contract {

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
                "other": "no"
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
                "other": "no"
            }
        ]

        for (let i = 0; i < initData.length; i++) {
            initData[i].docType = 'patient';
            await ctx.stub.putState('PID' + i, Buffer.from(JSON.stringify(initData[i])));
            console.log('Data Added:---', initData[i]);
        }
    }

    async getPatient(ctx, patientId){
        const patient = await ctx.stub.getState(patientId);
        if(patient.length || patient.length > 0){
            console.log(patient);
            let data = JSON.parse(patient.toString());
            return data;
        }

        throw new Error(`Patient ${patientId} does not exists`);
    }

    async getAllPatient(ctx){
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)){
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports = CommonContract;
