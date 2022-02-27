var express = require('express');
var router = express.Router();
const { Gateway, Wallets } = require('fabric-network');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const { DOCTOR_ROLE, validateRole, connectNetwork } = require('../utils/utils');
const { buildWallet, buildCCDoctor, buildCCLaboratory } = require('../utils/AppUtils');
const { buildCAClient } = require('../utils/CAUtils');
const FabricCAServices = require('fabric-ca-client');
const { response } = require('express');

router.get('/patient/all/:doctor', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  const networkObj = await connectNetwork(req.user.username, req.user.org);

});

router.patch('/patient/record/add/:patientId', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  let args = req.body;
  args.patientId = req.params.patientId;
  args.updatedBy = req.user.username;
  console.log(args);
  const networkObj = await connectNetwork(req.user.username, req.user.org);
  try{
    const response = await networkObj.contract.submitTransaction('DoctorContract:updatePatientRecord', JSON.stringify(args));
    console.log(response);
    await networkObj.gateway.disconnect();
    res.status(200).json({error:'none', message: 'Record added successfully'});
  }catch(error){
    res.status(500).json({error:'failed', message:'Failed to submit transaction'});
  }
});

module.exports = router;