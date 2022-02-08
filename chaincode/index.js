/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const CommonContract = require('./lib/common-contract');
const AdminContract = require('./lib/admin-contract');
const DoctorContract = require('./lib/doctor-contract');
const PatientContract = require('./lib/patient-contract');

module.exports.CommonContract = CommonContract;
module.exports.AdminContract = AdminContract;
module.exports.DoctorContract = DoctorContract;
module.exports.PatientContract = PatientContract;
module.exports.contracts = [CommonContract, AdminContract, DoctorContract, PatientContract];
