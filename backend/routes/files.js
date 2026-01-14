const express = require('express');
const router = express.Router();
const { s3 } = require('../config/aws');
const { getFileById, deleteFileMetadata } = require('../models/file');
const auth = require('../middleware/auth');

// Get signed URL for file preview/download
router.get('/:id', auth, async (req, res) => {
  try {
    const fileId = req.params.id;
    
    console.log('=== GET FILE ===');
    console.log('User ID:', req.user.id);
    console.log('File ID:', fileId);

    // Get file metadata using composite key (userId, id)
    const file = await getFileById(req.user.id, fileId);

    if (!file) {
      console.log('File not found');
      return res.status(404).json({ error: 'File not found' });
    }

    console.log('File found:', file.fileName);

    // Verify ownership (should already be guaranteed by composite key)
    if (file.userId !== String(req.user.id)) {
      console.log('Unauthorized access attempt');
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Use the stored s3Key
    const s3Key = file.s3Key;
    
    if (!s3Key) {
      console.log('S3 key not found in metadata');
      return res.status(500).json({ error: 'File key not found' });
    }

    console.log('Generating signed URL for:', s3Key);

    // Generate signed URL (valid for 1 hour)
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Expires: 3600,
    });

    res.json({
      downloadUrl: signedUrl,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to get file' });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const fileId = req.params.id;

    console.log('=== DELETE FILE ===');
    console.log('User ID:', req.user.id);
    console.log('File ID:', fileId);

    // Get file metadata using composite key
    const file = await getFileById(req.user.id, fileId);

    if (!file) {
      console.log('File not found');
      return res.status(404).json({ error: 'File not found' });
    }

    console.log('Deleting file:', file.fileName);

    // Delete from S3
    if (file.s3Key) {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.s3Key,
      }).promise();
      console.log('Deleted from S3');
    }

    // Delete from DynamoDB using composite key
    await deleteFileMetadata(req.user.id, fileId);
    console.log('Deleted from DynamoDB');

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;