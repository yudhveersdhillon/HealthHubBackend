var jwt = require('jsonwebtoken');
var CONFIG = require('../config/appConfig');
var issue = payload => {
    return jwt.sign(payload, CONFIG.JWT_ENCRYPTION);
};
var verify = (token, cb) => {
    return jwt.verify(token, CONFIG.JWT_ENCRYPTION, {}, cb);
};

module.exports = {
    issue: issue,
    verify: verify
};
