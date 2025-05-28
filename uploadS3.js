const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadToS3(filePath, fileName) {
  // Lê o arquivo local
  const fileContent = fs.readFileSync(filePath);

  // Monta os parâmetros do upload
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `encartes/${fileName}`,
    Body: fileContent,
    ContentType: 'image/png',
    ACL: 'public-read', // Deixa a imagem pública
  };

  // Realiza o upload e retorna a URL
  const data = await s3.upload(params).promise();
  return data.Location;
}

module.exports = uploadToS3;
