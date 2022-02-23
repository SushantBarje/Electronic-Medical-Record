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

router.get("/doctors/all/:organization", auth.verify, async (req, res) => {
  res.send('ok');
});

module.exports = router;