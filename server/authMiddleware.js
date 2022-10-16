const jwt = require('jsonwebtoken'),
      {secret} = require('./config');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]

        if(!token) {
            return res.status(403).json({message: 'Error authorization'});
        }

        const decodedData = jwt.verify(token, secret);

        req.user = decodedData;

        next();
    } catch (e) {
        return res.status(403).json({message: 'Error authorization'});
    }
}