const fs = require('fs');
const { createRedisConnection } = require('./utils/utils');
const { enrollDoctorAdmin } = require('./enrollDoctorAdmin');
const { enrollLabAdmin } = require('./enrollLabAdmin.js');

async function initRedis() {
  let redisClient = await createRedisConnection('doctor');
  console.log(redisClient);
  redisClient.SET('doctoradmin', 'doctorpw');
  console.log(await redisClient.GET('doctoradmin'));
  redisClient.QUIT();

  redisClient = await createRedisConnection('laboratory');
  redisClient.SET('laboratoryadmin', 'laboratorypw');
  console.log(await redisClient.GET('laboratoryadmin'));
  redisClient.QUIT();
  return;
}

async function init() {
  await initRedis();
  await enrollDoctorAdmin();
  await enrollLabAdmin();
}

init();
