var express = require('express');
var router = express.Router();
const { Gateway, Wallets } = require('fabric-network');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const { ADMIN_ROLE, DOCTOR_ROLE, validateRole, createRedisConnection, connectNetwork } = require('../utils/utils');
const { buildWallet, buildCCDoctor, buildCCLaboratory } = require('../utils/AppUtils');
const { buildCAClient } = require('../utils/CAUtils');
const FabricCAServices = require('fabric-ca-client');

router.get('/patient/all/:doctor', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  const networkObj = await connectNetwork(req.user.username, req.user.org);

});

router.patch('/patient/record/add/:patient', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  let args = req.body;
  args.patientId = req.params.patient;
  args.updatedBy = req.user.username;
  const networkObj = await connectNetwork(req.user.username, req.user.org);
  const response = await networkObj.contract.submitTransaction('DoctorContract:updatePatientRecord', args);


});

module.exports = router;