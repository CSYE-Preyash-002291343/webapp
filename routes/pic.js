const express = require('express');
const router = express.Router();
require('dotenv').config();
const authenticateUser = require('../middleware/authenticator');
const imageController = require('../controller/imageController');
const { uploadSingleImage } = require('../middleware/imageUpload');
const { checkVerificationStatus }= require('../middleware/userValidator');

//Add image
router.post('/', authenticateUser, checkVerificationStatus, uploadSingleImage, imageController.addImage);

router.head('/', async (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(405).send();
});

//Get image for user
router.get('/', authenticateUser, checkVerificationStatus, imageController.getImage);

//Delete image
router.delete('/', authenticateUser, checkVerificationStatus, imageController.deleteImage);

router.all('/', (req, res) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.status(405).send();
});

module.exports = router;