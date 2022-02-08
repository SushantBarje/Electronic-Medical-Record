/******************************************************************************
* @author Sushant Barje
* @created 2022-02-06 20:59:46
******************************************************************************/

'use  strict';

const CommonContract = require('./common-contract.js');
const { Context } = require('fabric-contract-api');

class PatientContract extends CommonContract {

    async getPatientRecord(ctx, patientId) {
        let result = await this.patientExists(ctx, patientId);
        if (!result) {
            throw new Error(`Patient does not exisits`);
        }
        return result;
    }

    async getPatientHistory(ctx, patientId) {
        console.log("PatientID ::::::");
        console.log(patientId);
        let iterator = await ctx.stub.getHistoryForKey('PID0');
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
}

module.exports = PatientContract;