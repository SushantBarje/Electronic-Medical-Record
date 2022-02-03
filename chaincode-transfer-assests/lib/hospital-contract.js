/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const initData = [
            {
                firstName: 'Sushant',
                middleName: '.H.',
                lastName: 'Barje',
                password: 'd74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1',
                age: '16',
                phoneNumber: '1234567890',
                address: 'Mumbai',
                bloodGroup: 'O+ve',
                updatedBy: 'initLedger',
                symptoms: 'fever',
                diagnosis: 'Covid',
                treatment: 'dolo 2 times',
                other: 'no'
            },
            {
                firstName: 'Five',
                middleName: '.H.',
                lastName: 'Barje',
                password: 'd74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1',
                age: '16',
                phoneNumber: '1234567890',
                address: 'Mumbai',
                bloodGroup: 'O+ve',
                updatedBy: 'initLedger',
                symptoms: 'fever',
                diagnosis: 'Covid',
                treatment: 'dolo 2 times',
                other: 'no'
            }
        ];

        for (let i = 0; i < initData.length; i++) {
            initData[i].docType = 'patient';
            await ctx.stub.putState('PID' + i, Buffer.from(JSON.stringify(initData[i])));
            console.log('Data Added:---', initData[i]);
        }
    }

    async hospitalExists(ctx, hospitalId) {
        const buffer = await ctx.stub.getState(hospitalId);
        return (!!buffer && buffer.length > 0);
    }

    async createHospital(ctx, hospitalId, value) {
        const exists = await this.hospitalExists(ctx, hospitalId);
        if (exists) {
            throw new Error(`The hospital ${hospitalId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalId, buffer);
    }

    async readHospital(ctx, hospitalId) {
        const exists = await this.hospitalExists(ctx, hospitalId);
        if (!exists) {
            throw new Error(`The hospital ${hospitalId} does not exist`);
        }
        const buffer = await ctx.stub.getState(hospitalId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateHospital(ctx, hospitalId, newValue) {
        const exists = await this.hospitalExists(ctx, hospitalId);
        if (!exists) {
            throw new Error(`The hospital ${hospitalId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalId, buffer);
    }

    async deleteHospital(ctx, hospitalId) {
        const exists = await this.hospitalExists(ctx, hospitalId);
        if (!exists) {
            throw new Error(`The hospital ${hospitalId} does not exist`);
        }
        await ctx.stub.deleteState(hospitalId);
    }

    async getAllPatient(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for (const { key, value } in ctx.stub.getStateByRange(startKey, endKey)) {
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

module.exports = HospitalContract;
