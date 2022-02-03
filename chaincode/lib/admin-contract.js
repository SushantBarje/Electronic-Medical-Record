/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const CommonContract = require('./common-contract');
const PatientAssets = require('./patient-assetss');

class AdminContract extends CommonContract {

    /**
     * 
     * @param {*} ctx 
     * @returns lastId
     */

    async getLastPatientId(ctx) {
        let result = await this.getAllPatient(ctx);
        console.log(result[result.length - 1].Key);
        return result[result.length - 1].Key;
    }

    /**
     * Create new Patient identity and put on Ledger.
     * @param {*} ctx 
     * @param {*} args 
     */
    async createPatient(ctx, args){

        args = JSON.parse(args);

        if(args.password === null || args.password === ''){
            throw new Error('password field is empty');
        }

        let patientData = new PatientAssets(args.patientId, args.firstName, args.middleName, args.lastName, args.password, args.age, args.phoneNumber, args.address, args.bloodGroup, args.updatedBy, args.other);
        const result = await this.getPatient(ctx, patientData.patientId);
        if(result){
            throw new Error(`Patient ${args.patientId} already exists`);
        }

        await ctx.stub.putState(patientData.patientId, Buffer.from(JSON.stringify(patientData)));
    }

    async getPatient(ctx, patientId){
        let patient = await super.getPatient(ctx, patientId);
        let data = ({
            patientId: patientId,
            firstName: patient.firstName,
            middleName: patient.middleName,
            phoneNumber: patient.phoneNumber,
        });
        return data;
    }

    async deletePatient(ctx, patientId){
        let result = await this.getPatient(ctx, patientId);
        if(!result){
            throw new Error(`Patient ${patientId} does not exists`);
        }
        await ctx.stub.deleteState(patientId);
    }

    async getAllPatient(ctx){
        let result = await this.getAllPatient(ctx);
        for(let i = 0; i < result.length; i++){
            const obj = result[i];
            result[i] = {
                patientId : obj.Key,
                firstName : obj.firstName,
                middleName : obj.middleName,
                lastName : obj.lastName,
                phoneNumber : obj.phoneNumber
            }
        }
        return result;
    }

    async getDoctor(ctx){
        let result = await this.getAllPatient(ctx);
        console.log(result);
        console.log("Get doctor function activate");
    }
}

module.exports = AdminContract;
