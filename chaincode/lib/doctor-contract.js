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
            treatment: patient.treatment
        });

        return patient;
    }

    async updatePatientRecord(ctx, obj) {
        obj = JSON.parse(obj);
        let change = false;
        const patient = await super.getPatient(ctx, obj.patientId);

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

        await ctx.putState(obj.patientId, Buffer.from(JSON.stringify(patient)));
    }

    async getClientID(ctx) {
        let identity = ctx.clientIdentity.getID();
        identity = identity.split('::')[1].split('/')[2].split('=');
        return identity[1].toString('utf8');
    }
    
}

module.exports = DoctorContract;