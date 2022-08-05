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
                "gender": "Male",
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
                "gender": "Male",
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

    async getPatient(ctx, patientId) {
        console.log("super:getPatient");
        console.log(patientId);
        const patient = await ctx.stub.getState(patientId);
        if (patient.length || patient.length > 0) {
            let data = JSON.parse(patient.toString());
            return data;
        }

        throw new Error(`Patient ${patientId} does not exists`);
    }

    async patientExists(ctx, patientId) {
        const buffer = await ctx.stub.getState(patientId);
        return (!!buffer && buffer.length > 0);
    }

    async getAllPatient(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            console.log(key);
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        return JSON.stringify(allResults);
    }

    async getPatientHistory(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();
            console.log("res");
            console.log(res);
            console.log("Res.value");
            console.log(res.value);
        
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
            console.log("res.value.value.toString()");
            console.log(res.value.value.toString());
            if (res.value !== undefined && res.value && res.value.value.toString()) {
                let jsonRes = {};
                if (isHistory && isHistory === true) {
                    jsonRes.Key = res.value.key;
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                console.log(jsonRes);
                allResults.push(jsonRes);
            }
        }
    }
}

module.exports = CommonContract;
