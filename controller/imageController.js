const { uploadFileToS3 } = require('../services/awsService');
const { saveImageDetails } = require('../models/imageModel');
const { Image } = require('../models/imageModel');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'us-east-1'
});
require('dotenv').config(); 
const StatsD = require('hot-shots');
const statsd = new StatsD();

exports.addImage = async (req, res) => {
    try {
        const userId = req.user.id; 
        const existingImage = await Image.findOne({ where: { user_id: userId } });

        if (existingImage) {
            res.header('Cache-Control', 'no-store');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            return res.status(400).send();
        }

        const file = req.file;
        if (!file) {
            res.header('Cache-Control', 'no-store');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            return res.status(400).send();
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.mimetype)) {
            res.header('Cache-Control', 'no-store');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            return res.status(400).send();
        }

        await uploadFileToS3(file, req.user.id, process.env.BUCKET);
        const customURL = `${process.env.BUCKET}/${userId}/${file.originalname}`;
        const start = process.hrtime();
        const savedImage = await saveImageDetails({
            userId: req.user.id, 
            url: customURL,
            filename: file.originalname,
            upload_date: new Date(),
        });
        const duration = process.hrtime(start);
        const durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);
        statsd.timing('db.save_image_time', durationInMs);

        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(201).json(savedImage);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(500).send();
    }
};

exports.getImage = async (req, res) => {
    try {
        const userId = req.user.id; 
        const image = await Image.findOne({ where: { user_id: userId } });

        if (!image) {
            return res.status(404).send();
        }

        const responseObject = {
            file_name: image.filename,
            id: image.id,
            url: image.url,
            upload_date: image.upload_date.toISOString().split('T')[0],
            user_id: image.user_id
        };

        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(200).json(responseObject);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(500).send();
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const userId = req.user.id; 
        const image = await Image.findOne({ where: { user_id: userId } });

        if (!image) {
            res.header('Cache-Control', 'no-store');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            return res.status(404).send();
        }

        const params = {
            Bucket: process.env.BUCKET,
            Key: `${req.user.id}/${image.filename}`
        };

        await s3.deleteObject(params).promise(); 
        await image.destroy();
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting image:', error);
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.status(500).send();
    }
};