/**
 * @author Sushant Barje
 * @descr Contract of doctor.
 */

'use strict';

const CommonContract = require('./common-contract');

class DoctorContract extends CommonContract {

    async getPatient(ctx, patientId) {
        let doctorId = await this.getClientID(ctx);
        let patient = await super.getPatient(ctx, patientId);
        if (!patient.permissionGranted.includes(doctorId)) {
            throw new Error(`You don't have access to this patient`);
        }

        patient = ({
            patientId: patientId,
            firstName: patient.firstName,
            middleName: patient.middleName,
            lastName: patient.lastName,
            age: patient.age,
            bloodGroup: patient.bloodGroup,
            symptoms: patient.symptoms,
            diagnosis: patient.diagnosis,
            treatment: patient.treatment,
            allergies: patient.allergies,
            other: patient.other,
            followUp: patient.followUp
        });

        return patient;
    }

    async getPatientHistory(ctx, patientId){
        console.log("PatientID ::::::");
        console.log(patientId);
        let iterator = await ctx.stub.getHistoryForKey(patientId);
        let result = await super.getPatientHistory(iterator, true);
        console.log("restult");
        console.log(result);
        result = JSON.parse(result);
        
        for(let i = 0; i < result.length; i++){
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
                bloodGroup: obj.Record.bloodGroup,
                allergies: obj.Record.allergies,
                updatedBy: obj.Record.updatedBy,
                diagnosis: obj.Record.diagnosis,
                treatment: obj.Record.treatment,
                other: obj.Record.other,
            }
        }
        console.log("RESULTT");
        console.log(result);
        return result;
    }

    async updatePatientRecord(ctx, obj) {
        console.log(obj);
        obj = JSON.parse(obj);
        console.log(obj);
        console.log(obj.patientId);
        let change = false;
        let patient = await super.getPatient(ctx, obj.patientId);
        console.log(patient);
        if (obj.symptoms !== null && obj.symptoms !== '' && obj.symptoms !== patient.symptoms) {
            patient.symptoms = obj.symptoms;
            change = true;
        }

        if (obj.diagnosis !== null && obj.diagnosis !== '' && obj.diagnosis !== patient.diagnosis) {
            patient.diagnosis = obj.diagnosis;
            change = true;
        }

        if (obj.treatment !== null && obj.treatment !== '' && obj.treatment !== patient.treatment) {
            patient.treatment = obj.treatment;
            change = true;
        }

        if (obj.other !== null && obj.other !== '' && obj.other !== patient.other) {
            patient.other = obj.other;
            change = true;
        }

        if (!change) return;

        await ctx.stub.putState(obj.patientId, Buffer.from(JSON.stringify(patient)));
    }

    async getClientID(ctx) {
        let identity = ctx.clientIdentity.getID();
        identity = identity.split('::')[1].split('/')[2].split('=');
        return identity[1].toString('utf8');
    }
    
}

module.exports = DoctorContract;