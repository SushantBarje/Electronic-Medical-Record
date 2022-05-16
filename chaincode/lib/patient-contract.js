/******************************************************************************
* @author Sushant Barje
* @created 2022-02-06 20:59:46
******************************************************************************/

'use  strict';

const CommonContract = require('./common-contract.js');
const { Context } = require('fabric-contract-api');

class PatientContract extends CommonContract {

    async getPatient(ctx, patientId) {
        return await super.getPatient(ctx, patientId);
    }

    async updatePatientDetails(ctx, obj) {
        obj = JSON.parse(obj);

        let firstName = obj.firstName;
        let middelName = obj.middleName;
        let lastName = obj.lastName;
        let age = obj.age;
        let updatedBy = obj.updatedBy;
        let address = obj.address;
        let phoneNumber = obj.phoneNumber;
        let allergies = obj.allergies;
        let isChanged = false;
        let patientId = obj.patientId;

        const patient = await this.getPatient(ctx, patientId);
        console.log(patient);
        if (firstName !== null && firstName !== '' && patient.Record.firstName !== firstName) {
            patient.Record.firstName = firstName;
            isChanged = true;
        }
        if (middelName !== null && middelName !== '' && patient.Record.middelName !== middelName) {
            patient.Record.middelName = middelName;
            isChanged = true;
        }
        if (lastName !== null && lastName !== '' && patient.Record.lastName !== lastName) {
            patient.Record.lastName = lastName;
            isChanged = true;
        }
        if (age !== null && age !== '' && patient.Record.age !== age) {
            patient.Record.age = age;
            isChanged = true;
        }
        if (address !== null && address !== '' && patient.Record.address !== address) {
            patient.Record.address = address;
            isChanged = true;
        }
        if (phoneNumber !== null && phoneNumber !== '' && patient.Record.phoneNumber !== phoneNumber) {
            patient.Record.phoneNumber = phoneNumber;
            isChanged = true;
        }
        if (allergies !== null && allergies !== '' && patient.Record.allergies !== allergies) {
            patient.Record.allergies = allergies;
            isChanged = true;
        }
        if (updatedBy !== null && updatedBy !== '') {
            patient.Record.updatedBy = updatedBy;
        }

        if (!isChanged) {
            return;
        }

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
    }

    async getPatientHistory(ctx, patientId) {
        console.log("PatientID ::::::");
        console.log(patientId);
        let iterator = await ctx.stub.getHistoryForKey(patientId);
        let result = await super.getPatientHistory(iterator, true);
        console.log("restult");
        console.log(result);
        result = JSON.parse(result);

        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            result[i] = {
                tx_id: obj.TxId,
                timestamp: obj.Timestamp,
                patientId: patientId,
                firstName: obj.Record.firstName,
                middleName: obj.Record.middleName,
                lastName: obj.Record.lastName,
                phoneNumber: obj.Record.phoneNumber,
                address: obj.Record.address,
                age: obj.Record.age,
                allergies: obj.Record.allergies,
                bloodGroup: obj.Record.bloodGroup,
                updatedBy: obj.Record.updatedBy,
                diagnosis: obj.Record.diagnosis,
                treatment: obj.Record.treatment,
                other: obj.Record.other,
                followUp: obj.Record.followUp,
                reportTitle: obj.Record.reportTitle,
                reportDescription : obj.Record.reportDescription,
                reportFile: obj.Record.reportFile
            }
        }
        console.log("RESULTT");
        console.log(result);
        return result;
    }

    async grantAccess(ctx, obj) {
        obj = JSON.parse(obj)
        let patientId = obj.patientId;
        let doctorId = obj.doctorId;
        const patient = await this.getPatient(ctx, patientId);
        if (!patient.permissionGranted.includes(doctorId)) {
            patient.permissionGranted.push(doctorId);
            patient.updatedBy = patientId;
        }

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
    }

    async revokeAccess(ctx, obj) {
        obj = JSON.parse(obj);
        let patientId = obj.patientId;
        let doctorId = obj.doctorId;
        const patient = await this.getPatient(ctx, patientId);
        if (patient.permissionGranted.includes(doctorId)) {
            patient.permissionGranted = patient.permissionGranted.filter(doctor => doctor !== doctorId);
            patient.updatedBy = patientId;
        }

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
    }

}

module.exports = PatientContract;