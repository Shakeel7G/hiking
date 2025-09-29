import express from 'express'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import crypto from 'crypto';
import db from '../config/db.js';
import sendPasswordResetEmail from '../services/emailService.js';

const router = express.Router(); // Create a new router instance to define API routes
const SECRET = process.env.JWT_SECRET || 'secret'; // Secret key used for signing JWTs (can be set in environment variables)

// Register user
router.post('/register', async (req, res) => {
  const { name, surname, email, password, role } = req.body; // Extract user details (full name, email, and password) from request body
  console.log("Incoming registration:", req.body); //  See data coming in
  try {
    // Hash the password with a salt rounds value of 10 for security
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user's details into the database with the hashed password
    await db.query(
      'INSERT INTO users (name, surname, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, surname, email, hashedPassword, role || 'customer']
    );
    
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error("Registration error:", err); // Log any error that occurs
    // Send an error response to the client if registration fails
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body
  try {
    // Query the database to find a user with the provided email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0]; // Retrieve the user data (if any)

    if (!user) {
      // If no user is found with the provided email, return a 404 error
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Password provided:", password);
    console.log("Password in DB:", user.password);
    // Compare the provided password with the hashed password stored in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // If the passwords don't match, return a 401 Unauthorized error
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Create a JWT token with the user's ID and role, which expires in 1 day
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });

    // Send a success response with the JWT token and basic user info
    res.json({ 
      message: 'Login successful', 
      token, // The generated JWT token
      user: { id: user.id, name: user.name, surname: user.surname, role: user.role } // User details (excluding password)
    });
  } catch (err) {
    console.error(err); // Log any error that occurs
    // Send an error response to the client if login fails
    res.status(500).json({ message: 'Login failed' });
  }
});

// Forgot password - generate reset token and send email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Store token in database
    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, resetTokenExpiry, email]
    );
    
    // Send email
    await sendPasswordResetEmail(email, resetToken);
    
    res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// Reset password - validate token and update password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  
  try {
    // Find user with valid reset token
    const [rows] = await db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );
    const user = rows[0];
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update password and clear reset token
    await db.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );
    
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Verify reset token (for frontend to check token validity)
router.get('/verify-reset-token/:token', async (req, res) => {
  const { token } = req.params;
  
  try {
    const [rows] = await db.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );
    const user = rows[0];
    
    if (!user) {
      return res.status(400).json({ valid: false, message: 'Invalid or expired reset token' });
    }
    
    res.status(200).json({ valid: true, message: 'Token is valid' });
  } catch (err) {
    console.error("Verify token error:", err);
    res.status(500).json({ valid: false, message: 'Failed to verify token' });
  }
});

// Export the router so it can be used in the main application
export default router;