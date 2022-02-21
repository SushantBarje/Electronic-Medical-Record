/** 
 * @author Sushant Barje
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const CommonContract = require('./common-contract');
const PatientAssets = require('./patient-assets');

class AdminContract extends CommonContract {

    async getLastPatientId(ctx) {
        const result = await this.getAllPatient(ctx);
        let maxId = '';
        let max = 0;
        for (let i = 0; i < result.length; i++) {
            if (max < parseInt(result[i].patientId.slice(3))) {
                maxId = result[i].patientId;
                max = parseInt(result[i].patientId.slice(3));
            }
        }
        console.log(maxId);
        return maxId;
        //return result[result.length - 1].patientId;
    }

    async createPatient(ctx, args) {
        console.log(args);
        args = JSON.parse(args);
        console.log(args);
        if (args.password === null || args.password === '') {
            throw new Error('password field is empty');
        }

        let patientData = new PatientAssets(args.patientId, args.firstName, args.middleName, args.lastName, args.password, args.age, args.phoneNumber, args.address, args.bloodGroup, args.allergies, args.updatedBy, args.other);
        const result = await this.patientExists(ctx, patientData.patientId);
        console.log(result);
        if (result) {
            throw new Error(`Patient ${args.patientId} already exists`);
        }

        await ctx.stub.putState(patientData.patientId, Buffer.from(JSON.stringify(patientData)));
    }

    async getPatient(ctx, patientId) {
        let patient = await super.getPatient(ctx, patientId);
        let data = ({
            patientId: patientId,
            firstName: patient.firstName,
            middleName: patient.middleName,
            phoneNumber: patient.phoneNumber,
        });
        return data;
    }

    async deletePatient(ctx, patientId) {
        let result = await this.getPatient(ctx, patientId);
        if (!result) {
            throw new Error(`Patient ${patientId} does not exists`);
        }
        await ctx.stub.deleteState(patientId);
    }

    async getAllPatient(ctx) {
        let result = await super.getAllPatient(ctx);
        console.log("getall");
        result = JSON.parse(result);
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            result[i] = {
                patientId: obj.Key,
                firstName: obj.Record.firstName,
                middleName: obj.Record.middleName,
                lastName: obj.Record.lastName,
                phoneNumber: obj.Record.phoneNumber
            }
        }
        console.log(result);
        return result;
    }
}

module.exports = AdminContract;
