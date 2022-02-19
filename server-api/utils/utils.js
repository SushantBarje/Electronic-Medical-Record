/**
* @author Sushant Barje
* @created 2022-02-17 T 10:14:22 
*/
const { Wallets, Gateway } = require('fabric-network');
const {buildCCDoctor, buildWallet} = require('./AppUtils');
const path = require('path');
const redis = require('redis');

exports.ADMIN_ROLE = 'admin';
exports.DOCTOR_ROLE = 'doctor';
exports.PATIENT_ROLE = 'patient';

let ccp;
let wallet;

exports.validateRole = async (allowedRole, myRole, res) => {
  console.log(allowedRole)
  console.log(myRole);
  console.log(allowedRole !== myRole);
  if(!myRole || !allowedRole || allowedRole !== myRole || myRole.length === 0 ){
    return res.status(401).json({message: 'Unauthorized Role'});
  }
}

exports.connectNetwork = async (userId, res) => {
  if(req.user.org === 'doctor'){
    try {
      ccp = buildCCDoctor();
      let walletPath = path.join(__dirname, 'wallet/doctor');
      wallet = await buildWallet(Wallets, walletPath);

      let identity = wallet.get(userId);
      if(!identity){
        return res.status()
      }
    }catch(err){

    }
  }
}

exports.createRedisConnection = async (org) => {

  let url;
  console.log(org);
  if (org === 'doctor') {
    url = 'redis://:doctorpassword@127.0.0.1:6379';
  } else if (org === 'laboratory') {
    url = 'redis://:labpassword@127.0.0.1:6380';
  } else {
    return null;
  }
  const redisClient = redis.createClient({ url: url });
  await redisClient.connect();
  return redisClient;
}