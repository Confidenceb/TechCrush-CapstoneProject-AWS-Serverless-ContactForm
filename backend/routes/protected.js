const express = require('express');
const auth = require('../middleware/auth');
const { getUserFiles } = require('../models/file');  // Use the model
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    console.log('=== GET USER FILES ===');
    console.log('User ID from token:', req.user.id);
    
    const files = await getUserFiles(req.user.id);
    
    console.log('Files found:', files.length);
    
    res.json({ files: files });
  } catch (err) {
    console.error('Error fetching user files:', err);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

module.exports = router;