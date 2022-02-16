const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign({username: user.username, role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"});
}

