/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const CommonContract = require('./lib/common-contract');
const AdminContract = require('./lib/admin-contract');

module.exports.CommonContract = CommonContract;
module.exports.AdminContract = AdminContract;
module.exports.contracts = [CommonContract, AdminContract];
