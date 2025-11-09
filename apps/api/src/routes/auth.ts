import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Login endpoint - Updated to use real database
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        subscription: true,
        artists: true,
        agency: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if subscription is active (for beta users, check expiry)
    if (user.subscription && user.subscription.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your subscription has expired. Please contact support.'
      });
    }

    // Check if beta period has expired
    if (user.subscription && user.subscription.currentPeriodEnd < new Date()) {
      // Update subscription status to expired
      await prisma.subscription.update({
        where: { userId: user.id },
        data: { status: 'EXPIRED' }
      });

      return res.status(403).json({
        success: false,
        message: 'Your beta access has expired. Contact us to upgrade to a paid plan.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success with user data
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        agencyId: user.agencyId,
        subscription: user.subscription ? {
          tier: user.subscription.tier,
          status: user.subscription.status,
          expiresAt: user.subscription.currentPeriodEnd
        } : null,
        artists: user.artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          genre: artist.genre
        }))
      }
    });

    // Log successful login
    console.log('✅ User logged in:', {
      email: user.email,
      role: user.role,
      subscription: user.subscription?.tier
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register endpoint - Updated to create real users
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, bandName, genre } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with artist profile (if provided)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash: passwordHash,
        role: 'ARTIST', // Default role for new registrations
        artists: bandName ? {
          create: {
            name: bandName.trim(),
            email: email.toLowerCase().trim(),
            genre: genre || null
          }
        } : undefined
      },
      include: {
        artists: true
      }
    });

    // Generate JWT token for immediate login
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        artists: user.artists.map(artist => ({
          id: artist.id,
          name: artist.name
        }))
      }
    });

    console.log('✅ New user registered:', {
      email: user.email,
      name: user.name,
      bandName: bandName || 'N/A'
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Verify token endpoint - Enhanced with database lookup
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        subscription: true,
        artists: true
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Check subscription status
    if (user.subscription && user.subscription.currentPeriodEnd < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Your subscription has expired'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription: user.subscription ? {
          tier: user.subscription.tier,
          status: user.subscription.status,
          expiresAt: user.subscription.currentPeriodEnd
        } : null
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // In a more advanced setup, you might want to blacklist the token
  // or clear it from Redis cache
  res.json({ success: true, message: 'Logged out successfully' });
});

// Password reset request endpoint (future implementation)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // TODO: Generate reset token, save to database, send email
    console.log('🔐 Password reset requested for:', email);

    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

export default router;
