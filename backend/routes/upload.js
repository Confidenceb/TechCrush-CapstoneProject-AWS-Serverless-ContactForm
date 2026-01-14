const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { s3 } = require('../config/aws');
const { saveFileMetadata } = require('../models/file');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const s3Key = `uploads/${req.file.originalname}`;

    console.log('=== FILE UPLOAD ===');
    console.log('User ID:', req.user.id);
    console.log('File ID:', fileId);
    console.log('S3 Key:', s3Key);

    // Upload to S3
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.upload(s3Params).promise();

    // Save metadata to DynamoDB with BOTH userId and id (composite key)
    const fileMetadata = {
      userId: String(req.user.id),  // Partition key
      id: fileId,                    // Sort key
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      s3Key: s3Key,
      uploadDate: new Date().toISOString(),
    };

    await saveFileMetadata(fileMetadata);

    console.log('File saved successfully');

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileMetadata,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;