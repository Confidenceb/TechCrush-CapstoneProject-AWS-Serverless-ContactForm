const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const { s3 } = require('../config/aws');
const { dynamo } = require('../config/aws');
const router = express.Router();

const USERS_TABLE = process.env.DYNAMO_USER_TABLE;

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for avatars'));
    }
  }
});

// GET /api/profile - Get user profile
router.get('/', auth, async (req, res) => {
  try {
    // Query DynamoDB for user data
    const params = {
      TableName: USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': req.user.email
      }
    };

    const result = await dynamo.query(params).promise();
    
    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.Items[0];

    // Return user profile (excluding password)
    res.json({
      id: user.userId,
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      createdAt: user.createdAt
    });

  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - Update user profile (name only, no avatar)
router.put('/', auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Query to get user's partition key (userId)
    const queryParams = {
      TableName: USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': req.user.email
      }
    };

    const queryResult = await dynamo.query(queryParams).promise();
    
    if (!queryResult.Items || queryResult.Items.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = queryResult.Items[0];

    // Update user in DynamoDB
    const updateParams = {
      TableName: USERS_TABLE,
      Key: {
        userId: user.userId
      },
      UpdateExpression: 'SET #name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamo.update(updateParams).promise();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: result.Attributes.userId,
        email: result.Attributes.email,
        name: result.Attributes.name,
        avatar: result.Attributes.avatar || null
      }
    });

  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// POST /api/profile/avatar - Upload avatar image
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Query to get user's partition key (userId)
    const queryParams = {
      TableName: USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': req.user.email
      }
    };

    const queryResult = await dynamo.query(queryParams).promise();
    
    if (!queryResult.Items || queryResult.Items.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = queryResult.Items[0];

    // Upload to S3
    const fileExtension = req.file.originalname.split('.').pop();
    const s3Key = `avatars/${user.userId}-${Date.now()}.${fileExtension}`;

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'private' // Keep avatars private, we'll use signed URLs
    };

    const uploadResult = await s3.upload(s3Params).promise();

    // Delete old avatar from S3 if it exists
    if (user.avatar) {
      try {
        const oldKey = user.avatar.split('.com/')[1];
        if (oldKey) {
          await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: oldKey
          }).promise();
        }
      } catch (deleteErr) {
        console.error('Failed to delete old avatar:', deleteErr);
        // Continue anyway, don't fail the upload
      }
    }

    // Update user in DynamoDB with new avatar URL
    const updateParams = {
      TableName: USERS_TABLE,
      Key: {
        userId: user.userId
      },
      UpdateExpression: 'SET avatar = :avatar',
      ExpressionAttributeValues: {
        ':avatar': uploadResult.Location
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamo.update(updateParams).promise();

    // Generate signed URL for the avatar (valid for 7 days)
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Expires: 7 * 24 * 60 * 60 // 7 days
    });

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: signedUrl,
      user: {
        id: result.Attributes.userId,
        email: result.Attributes.email,
        name: result.Attributes.name,
        avatar: signedUrl
      }
    });

  } catch (err) {
    console.error('Error uploading avatar:', err);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
});

module.exports = router;