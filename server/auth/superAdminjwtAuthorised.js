// const Manager = require("../models/manager");
const superAdmin = require("../models/superAdmin");
const CONFIG = require("../config/appConfig");
const jwtUtil = require("../utils/JwtUtils");

module.exports = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length !== 2)
            return res.reject(CONFIG.ERROR_CODE_UNAUTHORIZED, CONFIG.TOKENNOTCORRECT);

        const token = parts[1];
        const scheme = parts[0];
        jwtUtil.verify(token, (error, user) => {
            if (error)
                return res.reject(
                    CONFIG.ERROR_CODE_UNAUTHORIZED,
                    CONFIG.TOKENNOTCORRECT
                );
            superAdmin.findOne({ _id: user._id })
                .lean()
                .then(async (user) => {
                    if (!user)
                        return res.reject(
                            CONFIG.ERROR_CODE_UNAUTHORIZED,
                            CONFIG.TOKENNOTCORRECT
                        );

                    if (user.status !== CONFIG.ACTIVE_STATUS)
                        return res.reject(
                            CONFIG.ERROR_CODE_UNAUTHORIZED,
                            CONFIG.DISABLED_AUTHORIZATION
                        );
                    if (user.role != 'superAdmin') {
                        return res.reject(
                            CONFIG.ERROR_CODE_UNAUTHORIZED,
                            CONFIG.DISABLED_AUTHORIZATION
                        );
                    }
                    req.user = user;
                    next();
                });
        });
    } else {
        return res.reject(CONFIG.ERROR_CODE_UNAUTHORIZED, CONFIG.TOKEN_MISSING);
    }
};
