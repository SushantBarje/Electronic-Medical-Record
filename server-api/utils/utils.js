/**
* @author Sushant Barje
* @created 2022-02-17 T 10:14:22 
*/

const redis = require('redis');

exports.ADMIN_ROLE = 'admin';
exports.DOCTOR_ROLE = 'doctor';
exports.PATIENT_ROLE = 'patient';

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