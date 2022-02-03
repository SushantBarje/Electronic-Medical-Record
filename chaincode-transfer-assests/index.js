/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const HospitalContract = require('./lib/hospital-contract');
const AdminContract = require('./lib/admin-contract');

module.exports.HospitalContract = HospitalContract;
module.exports.AdminContract = AdminContract;
module.exports.contracts = [ HospitalContract, AdminContract ];
