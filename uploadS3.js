// uploadS3.js

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadToS3(filePath, fileName) {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `encartes/${fileName}`,
    Body: fileContent,
    ContentType: 'image/png',
    // Retire a linha abaixo se o bucket não permitir mais ACL
    // ACL: 'public-read',
  };

  const data = await s3.upload(params).promise();
  return data.Location;
}

module.exports = uploadToS3;
