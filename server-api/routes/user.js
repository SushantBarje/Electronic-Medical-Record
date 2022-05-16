var express = require('express');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ADMIN_ROLE, DOCTOR_ROLE, PATIENT_ROLE, createRedisConnection, connectNetwork } = require('../utils/utils');
var router = express.Router();

let refreshTokens = [];

router.post('/login', async (req, res) => {
  console.log(req.body);
  const { username, password, role, organization = 'doctor' } = req.body;

  let user = false;
  if (role === ADMIN_ROLE || role === DOCTOR_ROLE) {
    const redisClient = await createRedisConnection(organization);
    user = (password == (await redisClient.GET(username)));
  }
  
  if (role === PATIENT_ROLE) {
  
    const network = await connectNetwork(username, organization, PATIENT_ROLE);
    console.log(network);
    // const userIdentity = network.error && res.status('400').json({network.error, network.msg});
    const result = await network.contract.evaluateTransaction('PatientContract:getPatient', username);
    user = JSON.parse(result).password.toString('utf8') == crypto.createHash('sha256').update(password).digest('hex');
    
    await network.gateway.disconnect();
  }

  if (user) {
    const accessToken = auth.generateAccessToken({ username: username, role: role, organization: organization });
    const refreshToken = auth.generateRefreshToken({ username: username, role: role, organization: organization });
    refreshTokens.push(refreshToken);
    res.status(200).json({
      accessToken,
      role,
      refreshToken
    });
  } else {
    res.status(401).json("User not found!");
  }
})

router.post('/refresh', (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.status(401).json("You are not authenticated.");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh Token is not valid.");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    const newAccessToken = auth.generateAccessToken(user);
    const newRefreshToken = auth.generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      role: user.role,
      refreshToken: newRefreshToken
    })
  })
})

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.headers.token);
  res.sendStatus(204).json("logout done");
});

router.delete('/user/:userId', auth.verify, (req, res) => {
  if (req.user.id === req.params.role || req.user.role) {
    res.status(200).json("User is deleted");
  } else {
    res.status(401).json("You are not authorized");
  }
})

module.exports = router;