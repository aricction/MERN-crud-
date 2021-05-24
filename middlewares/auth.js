const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next) {
    /** get token */

    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg: 'no token found'});
    }
    try{
          const decodetoken = jwt.verify(token, config.get('SecretKey'));
          res.user = decodetoken.user;
          next();
    }catch (err) {
        res.status(401).json({msg: ' token is invalid'});

    }
} 