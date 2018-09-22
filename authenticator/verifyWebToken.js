var jwt = require('jsonwebtoken');
var config = require('../config/application-properties'); // get encryption key

module.exports = function verifyToken(req, res, next) {
  var webToken = req.headers['jwt-token'];
  if (!webToken) 
    return res.status(403).send({ auth: false, message: 'No token found...' });

    try {
      decryptedVal = jwt.verify(webToken, config.encryptionKey);
      //console.log(decryptedVal)
      req.userId = decryptedVal.id;
      next();
    } catch (error) {
      return res.status(500).send({ auth: false, message: 'Authentication Failed...' + err });  
    }
}

 