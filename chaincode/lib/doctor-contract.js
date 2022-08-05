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
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        symptoms: patient.symptoms,
        diagnosis: patient.diagnosis,
        treatment: patient.treatment,
        allergies: patient.allergies,
        other: patient.other,
        followUp: patient.followUp,
        reportTitle : patient.reportTitle,
        reportFile : patient.reportFile,
        reportDescription : patient.reportDescription
        });

        return patient;
    }

    async getAllPatient(ctx, doctorId) {
        console.log("DoctorId is: " + doctorId);
        let result = await super.getAllPatient(ctx);
        result = JSON.parse(result);
        const permissionAssets = [];
        for (let i = 0; i < result.length; i++) {
        const obj = result[i];
        console.log(obj);
        console.log("PermissionGranted check");
        console.log('PermissionGranted' in obj.Record);
        if ('permissionGranted' in obj.Record && obj.Record.permissionGranted.includes(doctorId)) {
        console.log("permission");
        result[i] = {
            patientId: obj.Key,
            firstName: obj.Record.firstName,
            middleName: obj.Record.middleName,
            lastName: obj.Record.lastName,
            phoneNumber: obj.Record.phoneNumber,
            age: obj.Record.age,
            phoneNumber: obj.Record.phoneNumber,
            gender: obj.Record.gender,
            bloodGroup: obj.Record.bloodGroup,
            updatedBy: obj.Record.updatedBy,
            allergies: obj.Record.allergies,
            symptoms: obj.Record.symptoms,
            diagnosis: obj.Record.diagnosis,
            treatment: obj.Record.treatment,
            other: obj.Record.other,
            followUp: obj.Record.followUp,
            reportTitle: obj.Record.reportTitle,
            reportDescription : obj.Record.reportDescription,
            reportFile: obj.Record.reportFile
            }
        permissionAssets.push(result[i]);
        console.log(permissionAssets);
        }
    }
    console.log(permissionAssets);
    return permissionAssets;
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
                gender: obj.Record.gender,
                address: obj.Record.address,
                age: obj.Record.age,
                bloodGroup: obj.Record.bloodGroup,
                allergies: obj.Record.allergies,
                updatedBy: obj.Record.updatedBy,
                diagnosis: obj.Record.diagnosis,
                symptoms: obj.Record.symptoms,
                treatment: obj.Record.treatment,
                followUp: obj.Record.followUp,
                other: obj.Record.other,
                reportTitle: obj.Record.reportTitle,
                reportDescription : obj.Record.reportDescription,
                reportFile: obj.Record.reportFile
            }
        }
        console.log("RESULTT");
        console.log(result);
        return result;
    }

    async updatePatientRecord(ctx, obj) {
        obj = JSON.parse(obj);
        console.log(obj);
        let change = false;
        let patient = await super.getPatient(ctx, obj.patientId);

        if(patient.permissionGranted.includes(obj.updatedBy)){

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
        
            if(obj.reportTitle !== null && obj.reportTitle !== '' && obj.reportTitle !== patient.reportTitle){
                patient.reportTitle = obj.reportTitle;
                change = true;
            }

            if(obj.reportFile !== null && obj.reportFile !== '' && obj.reportFile !== patient.reportFile){
                patient.reportFile = obj.reportFile;
                change = true;
            }

            if(obj.reportDescription !== null && obj.reportDescription !== '' && obj.reportDescription !== patient.reportDescription){
                patient.reportDescription = obj.reportDescription;
                change = true;
            }

            if(obj.followUp !== null && obj.followUp !== '' && obj.followUp !== patient.followUp){
                patient.followUp = obj.followUp;
                change = true;
            }

            patient.updatedBy = obj.updatedBy;
                
            if (!change) {
                return;
            } else {
                await ctx.stub.putState(obj.patientId, Buffer.from(JSON.stringify(patient)));
            }
        }else{
            return false;
        }
    }

    // async getDoctorAccessToPatient(ctx, patientId){
    // let patient = await super.getPatient(ctx, patientId);
        
    // }

    async getClientID(ctx) {
        let identity = ctx.clientIdentity.getID();
        identity = identity.split('::')[1].split('/')[2].split('=');
        return identity[1].toString('utf8');
    }
 }
 
 module.exports = DoctorContract;