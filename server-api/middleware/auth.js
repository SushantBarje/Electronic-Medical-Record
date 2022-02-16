const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign({username: user.username, role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s"});
}

exports.generateRefreshToken = (user) => {
  return jwt.sign({username: user.username, role: user.role}, process.env.REFRESH_TOKEN_SECRET);
}

exports.verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  
  if(token == null){
    res.status(401).json("You are not authenticated");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
      console.log(err);
      res.status(403).json("Token not valid.");
    }

    req.user = user;
    next();
  });
}
