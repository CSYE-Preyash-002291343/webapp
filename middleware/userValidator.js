const User = require('../models/userModel');

exports.checkVerificationStatus = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user.verificationStatus) {
            return res.status(403).send();
        }

        next();
    } catch (error) {
        console.error('Error checking verification status:', error);
        res.status(500).send();
    }
};