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
const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient.create('http://localhost:5001');

router.get('/patient/all', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  const networkObj = await connectNetwork(req.user.username, req.user.org);
  const response = await networkObj.contract.evaluateTransaction('DoctorContract:getAllPatient', req.user.username)
  console.log(response.toString());
  if (response.length) {
    res.status(200).send({ error: "none", message: await JSON.parse(response) });
    console.log("Record found");
  } else {
    console.log("Record empty");
  }
});

router.get('/patient/record/:patientId/history', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  let patientId = req.params.patientId;
  const networkObj = await connectNetwork(req.user.username, req.user.org);
  try {
    const response = await networkObj.contract.evaluateTransaction('DoctorContract:getPatientHistory', patientId);
    console.log(response.toString());
    res.status(200).json({ error: "none", message: await JSON.parse(response) });
  } catch (error) {
    res.status(400).json(error);
  }
})

router.post('/patient/record/add', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  console.log("body"+req.body);
  let args = req.body;
  args.patientId = req.body.patientId;
  args.updatedBy = req.user.username;
  console.log(args);
  const networkObj = await connectNetwork(req.user.username, req.user.org);
  try {
    let response = await networkObj.contract.evaluateTransaction('DoctorContract:getPatient', patientId);
    console.log(response);
    response = await networkObj.contract.submitTransaction('DoctorContract:updatePatientRecord', JSON.stringify(args));
    console.log(response);
    await networkObj.gateway.disconnect();
    if (response.toString() == 'false') {
      res.status(200).json({ error: 'none', message: "You are not Authorized." });
    } else {
      res.status(200).json({ error: 'none', message: response.toString() });
    }
  } catch (error) {
    res.status(500).json({ error: 'failed', message: 'Failed to submit transaction' });
  }
});

router.patch('/patient/record/add/:patientId/lab/report/add', auth.verify, async (req, res) => {
  await validateRole(DOCTOR_ROLE, req.user.role, res);
  let report = {};
  console.log(req.body);
  console.log(req.params);
  report.patientId = req.params.patientId;
  report.updatedBy = req.user.username;
  report.reportTitle = req.body.title;
  report.reportDescription = req.body.description;
  report.reportFile = '';
  if(req.user.org != 'laboratory'){
    res.status(401).json({error: "not authorized", msg: "You are not authorized"});
  }else{
    const networkObj = await connectNetwork(req.user.username, req.user.org);
    const file = req.files.file;
    const fileName = file.name;
    const filePath = __dirname + '/../files/' + fileName;

    file.mv(filePath, async (err) => {
        if(err) return res.status(500).json({error: "not_uploaded", message: "ERROR: File not uploaded.."+ err});
        const fileHash = await addIpfsFile(fileName, filePath);
        report.reportFile = fileHash.toString();
        fs.unlink(filePath, (err)=>{
          if(err) {
            res.status(500).json({error: "not_uploaded", message: "ERROR: File not uploaded.."+ err});
          }
        });
        
        try{ 
          let response = await networkObj.contract.submitTransaction('DoctorContract:updatePatientRecord', JSON.stringify(report));
          console.log(response.toString());
          await networkObj.gateway.disconnect();
          if (response.toString() == 'false') {
            res.status(200).json({ error: 'none', message: "You are not Authorized." });
          }else{
            res.status(200).json({error: "none", message: "File Uploaded. CID: " + fileHash });
          }
        }catch(error){
          res.status(500).json({ error: 'failed', message: 'Failed to submit transaction' });
        }
        
    });
  }

});


const addIpfsFile = async (fileName, filePath) => {
  console.log("Add");
  const file = fs.readFileSync(filePath);
  console.log(file);
  const fileAdded = await ipfs.add({path: fileName, content: file});
  
  console.log(fileAdded);
  const {cid} = fileAdded;
  return cid;
}

module.exports = router;