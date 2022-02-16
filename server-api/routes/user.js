var express = require('express');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
var router = express.Router();

const users = [
  {
    username: "sushant",
    password: "sus123",
    role: "patient"
  }
]

let refreshTokens = [];

router.post('/', (req, res) => {
  const { username, password, role } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  if (user) {
    const accessToken = auth.generateAccessToken(user);
    const refreshToken = auth.generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.status(200).json({
      username: user.username,
      role: user.role,
      accessToken,
      refreshToken
    });
  } else {
    res.status(400).json("User not found!");
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
      refreshToken: newRefreshToken
    })
  })
})

router.delete('/user/:userId', auth.verify, (req, res) => {
  if(req.user.id === req.params.role || req.user.role){
    res.status(200).json("User is deleted");
  }else{
    res.status(401).json("You are not authorized");
  }
})

module.exports = router;