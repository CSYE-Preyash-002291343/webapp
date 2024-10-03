const bcrypt = require('bcrypt');
const auth = require('basic-auth');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
    const cred = auth(req);
    if (!cred) {
        return res.status(401).send();
    }
    try {
        const user = await User.findOne({ where: { email: cred.name } });
        if (!user) {
            res.header('Cache-Control', 'no-store');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            return res.status(401).send();
        }
        const isValid = await bcrypt.compare(cred.pass, user.password);
        if (!isValid) {
            res.header('Cache-Control', 'no-store');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            return res.status(401).send();
        }
        req.user = user.dataValues;
        next();
    } catch (error) {
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        return res.status(503).send();
    }
};

module.exports = authenticateUser;