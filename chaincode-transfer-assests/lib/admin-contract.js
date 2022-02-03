/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const HospitalContract = require('./hospital-contract');

class AdminContract extends HospitalContract {


    async getLastPatientId(ctx) {
        let result = await this.getAllPatient(ctx);
        console.log(result);
        return result[result.length - 1].patiendId;
    }
}

module.exports = AdminContract;
