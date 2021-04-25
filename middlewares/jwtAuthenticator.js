const jwt = require("jsonwebtoken");
module.exports.authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if(!token){
    return res.json({
      success: false,
      status: 403,
      msg: "token not found !!!!",
    });
  }


  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.json({
          success: false,
          status: 403,
          msg: "Authentication Failed",
        });
      }

      req.user = user;
      next();
    });
  } else {
    res.json({
      success: false,
      status: 401,
      msg: "Authentication Failed",
    });
  }
};

module.exports.generateJWT = (userId) => {
    return jwt.sign({userId}, process.env.TOKEN_SECRET, { expiresIn: '10m' });
}