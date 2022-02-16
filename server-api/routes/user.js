var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();

const users = [
  {
    username: "sushant",
    password: "sus123",
    role: "patient"
  }
]

router.post('/', (req, res) => {
  const {username, password, role} = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  if(user){
    const accessToken = auth.generateAccessToken(user);
    res.status(200).json({
      username: user.username,
      role: user.role,
      accessToken
    });
  }else{
    res.status(400).json("User not found!");
  }
})

module.exports = router;