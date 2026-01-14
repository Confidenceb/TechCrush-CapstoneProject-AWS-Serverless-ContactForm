const AWS = require('aws-sdk');

// No keys needed if running on EC2 with IAM Role
// AWS.config.update({
//   region: process.env.AWS_REGION
// });

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = { s3, dynamo };
