const { body, validationResult } = require('express-validator');

const acceptedpayload = ['first_name', 'last_name', 'email', 'password'];
const ignoredfields = ['account_created', 'account_updated', 'verificationStatus', 'verificationToken', 'verificationTokenExpires'];

const validateCreateUser = [
    body('first_name').trim().isAlpha(),
    body('last_name').trim().isAlpha(),
    body('email').isEmail(),
    (req, res, next) => {
        const fields = Object.keys(req.body);
        const isValid = fields.every((field) => acceptedpayload.includes(field)|| ignoredfields.includes(field));
        if (!isValid) {
            return res.status(400).send();
        }
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).send();
        }
        next();
    }
];

module.exports = validateCreateUser;