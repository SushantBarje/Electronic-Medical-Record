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

router.get('/patient/all', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  const networkObj = await connectNetwork(req.user.username, req.user.org);
  const response = await networkObj.contract.evaluateTransaction('DoctorContract:getAllPatient', req.user.username)
  console.log(response.toString());
  //const parsedResponse = await JSON.parse(respone)
  if(response.length){
    res.status(200).send({error: "none", message: await JSON.parse(response)});
    console.log("Record found");
  }else{
    console.log("Record empty");
  }
})

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
    res.status(200).json({error:'none', message: response.toString()});
  }catch(error){
    res.status(500).json({error:'failed', message:'Failed to submit transaction'});
  }
});

module.exports = router;