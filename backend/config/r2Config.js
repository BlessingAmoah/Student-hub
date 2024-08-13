const AWS = require('aws-sdk');

const r2 = new AWS.S3({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT, 
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  region: 'auto',
  signatureVersion: 'v4',
});

module.exports = r2;
