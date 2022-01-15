var express = require('express');
var router = express.Router();
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/admin/login', (req, res) => {
    
})

module.exports = router;