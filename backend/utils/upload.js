const { s3 } = require('../config/aws');  // ✅ Destructure

function uploadFile(file, key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  return s3.upload(params).promise();
}

module.exports = uploadFile;