/**
* @author Sushant Barje
* @created 2022-02-17 T 10:14:22 
*/
const { Wallets, Gateway } = require('fabric-network');
const { buildCCDoctor, buildWallet, buildCCLaboratory } = require('./AppUtils');
const path = require('path');
const redis = require('redis');

exports.ADMIN_ROLE = 'admin';
exports.DOCTOR_ROLE = 'doctor';
exports.PATIENT_ROLE = 'patient';



exports.validateRole = (allowedRole, myRole) => {
  if (!myRole || !allowedRole || allowedRole !== myRole || myRole.length === 0) {
    return false;
  }
  return true;
}

exports.connectNetwork = async (userId, organization) => {
  try {
    let ccp;
    let wallet;
    console.log(organization);
    if(organization === 'doctor'){
      ccp = buildCCDoctor();
    }else{
      ccp = buildCCLaboratory();
    }
    walletPath = path.join(__dirname, '../wallet');
    wallet = await buildWallet(Wallets, walletPath);
    const identity = wallet.get(userId);
    if(!identity){
      console.log({error: `${userId} not exists`});
    }

    // if (organization === 'doctor') {
    //   ccp = buildCCDoctor();
    //   let walletPath;
    //   if (role === 'patient') {
    //     walletPath = path.join(__dirname, '../wallet/patient');
    //   } else {
    //     walletPath = path.join(__dirname, '../wallet/doctor');
    //   }
    //   console.log(walletPath);
    //   wallet = await buildWallet(Wallets, walletPath);

    //   const identity = wallet.get(userId);
    //   if (!identity) {
    //     console.log({ error: "userId not exists" });
    //   }
    // } else if (organization === 'laboratory') {
    //   ccp = buildCCLaboratory();
    //   let walletPath = path.join(__dirname, '../wallet/laboratory');
    //   wallet = await buildWallet(Wallets, walletPath);

    //   const identity = wallet.get(userId);
    //   if (!identity) {
    //     console.log({ error: "userId not exists" });
    //   }
    // }
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userId, discovery: { enabled: true, asLocalhost: true } })

    const network = await gateway.getNetwork('hospital');
    const contract = network.getContract('basic');

    const networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };

    console.log("Successfully connected to network.");
    return networkObj;
  } catch (err) {
    console.log(`Error while establishing network. ${err}`);
    throw new Error({ error: err, message: `Error while establishing network. ${err}` });
  }
}

exports.createRedisConnection = async (org) => {

  let url;

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