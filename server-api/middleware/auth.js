const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign({username: user.username, role: user.role, org: user.organization}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60m"});
}

exports.generateRefreshToken = (user) => {
  return jwt.sign({username: user.username, role: user.role, org: user.organization}, process.env.REFRESH_TOKEN_SECRET);
}

exports.verify = (req, res, next) => {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  
  if(token == null){
    res.status(401).json("You are not authenticated");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
      console.log(err);
      res.status(403).json({error:'token expire', msg: "Token not valid."});
    }
    req.user = user;
    next();
  });
}
