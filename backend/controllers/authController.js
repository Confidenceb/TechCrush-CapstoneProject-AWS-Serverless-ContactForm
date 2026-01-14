const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const { createUser, getUserByEmail } = require('../models/user');

// Register
exports.register = async (req, res) => {
  console.log('REGISTER BODY:', req.body);
  
  try {
    const { name, email, password } = req.body || {}

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)
    
    // Use ONE consistent ID for the user
    const userId = uuidv4();

    await createUser({
      userId: userId,  // Partition key in DynamoDB
      id: userId,      // Same as userId for consistency
      name,
      email,
      password: hashed,
      createdAt: new Date().toISOString()
    })

    console.log('User created with ID:', userId);

    res.status(201).json({ message: 'User registered successfully' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('=== LOGIN REQUEST ===');
  console.log('1. Email:', email);
  
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      console.log('2. User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('2. User found:', { 
      userId: user.userId, 
      id: user.id, 
      email: user.email 
    });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('3. Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('3. Password match - creating token');

    // CRITICAL FIX: Use userId (not id) for the JWT token
    // This must match what's used as partition key in file operations
    const token = jwt.sign(
      { 
        id: user.userId,      // ✅ Use userId here (matches partition key)
        userId: user.userId,  // Also include as userId for clarity
        name: user.name, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('4. Token created with user.id:', user.userId);
    
    res.json({ 
      token,
      user: {
        id: user.userId,     // ✅ Return userId
        email: user.email,
        name: user.name,
        avatar: user.avatar || null
      }
    });
    
    console.log('5. Login successful');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};