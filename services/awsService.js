const AWS = require('aws-sdk');
const StatsD = require('hot-shots');
const statsd = new StatsD();

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'us-east-1'
});

exports.uploadFileToS3 = function(file, userId, bucketName) {
    const start = process.hrtime();

    const params = {
        Bucket: bucketName,
        Key: `${userId}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    return s3.upload(params).promise().then(result => {
        const duration = process.hrtime(start);
        const durationInMs = (duration[0] * 1000) + (duration[1] / 1000000);
        statsd.timing('s3.upload_time', durationInMs);
        
        return result;
    });
};