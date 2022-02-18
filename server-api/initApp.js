/**
* @author Sushant Barje
* @created 2022-02-18 T 08:17:56
* @desc Creating admin credentials and store credientials in redis db before starting server.
*/

const { createRedisConnection } = require('./utils/utils');
const { enrollDoctorAdmin } = require('./enrollDoctorAdmin');
const { enrollLabAdmin } = require('./enrollLabAdmin.js');

/**
 * @params {null}
 * @returns {null}
 * @description initialize Redis connection and store admin credientials for organizations.
 */

async function initRedis() {
  let redisClient = await createRedisConnection('doctor');
  await redisClient.SET('doctoradmin', 'doctorpw');
  await redisClient.GET('doctoradmin');
  redisClient.QUIT();

  redisClient = await createRedisConnection('laboratory');
  await redisClient.SET('laboratoryadmin', 'laboratorypw');
  await redisClient.GET('laboratoryadmin');
  redisClient.QUIT();
  return;
}

async function init() {
  await initRedis();
  await enrollDoctorAdmin();
  await enrollLabAdmin();
}

init();
