const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'us-east-1'
});

exports.uploadFileToS3 = function(file, bucketName) {
    const params = {
        Bucket: bucketName,
        Key: `${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    return s3.upload(params).promise();
};