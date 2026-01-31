// server.js - Express Backend for M&T Community Platform

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ===== AUTHENTICATION ENDPOINTS =====

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, year, bio } = req.body;

    // Validate input
    if (!email || !password || !name || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Default avatar
    const defaultAvatar = {
      bodyColor: '#2C3E50',
      bellyColor: '#FFFFFF',
      hatColor: '#E74C3C',
      hatStyle: 'beanie',
      accessory: 'none',
      eyeStyle: 'happy',
      beakColor: '#FF9800',
      backgroundColor: '#87CEEB'
    };

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, year, bio, avatar, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, name, year, bio, avatar, status, created_at`,
      [email, passwordHash, name, year, bio || '', JSON.stringify(defaultAvatar), 'available']
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        year: user.year,
        bio: user.bio,
        avatar: user.avatar,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        year: user.year,
        bio: user.bio,
        avatar: user.avatar,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ===== USER ENDPOINTS =====

// Get all users
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const { year, status } = req.query;
    
    let query = 'SELECT id, name, year, bio, avatar, status, created_at FROM users WHERE id != $1';
    const params = [req.user.user_id];
    let paramCount = 1;

    if (year) {
      paramCount++;
      query += ` AND year = $${paramCount}`;
      params.push(year);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific user
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, year, bio, avatar, status, created_at FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    // Check if updating own profile
    if (parseInt(req.params.id) !== req.user.user_id) {
      return res.status(403).json({ error: 'Can only update own profile' });
    }

    const { bio, status, avatar } = req.body;
    const updates = [];
    const params = [];
    let paramCount = 0;

    if (bio !== undefined) {
      paramCount++;
      updates.push(`bio = $${paramCount}`);
      params.push(bio);
    }

    if (status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      params.push(status);
    }

    if (avatar !== undefined) {
      paramCount++;
      updates.push(`avatar = $${paramCount}`);
      params.push(JSON.stringify(avatar));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    params.push(req.params.id);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, name, year, bio, avatar, status
    `;

    const result = await pool.query(query, params);
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== COFFEE REQUEST ENDPOINTS =====

// Send coffee request
app.post('/api/requests', authenticateToken, async (req, res) => {
  try {
    const { to_user_id, location, time_options, message } = req.body;

    if (!to_user_id || !location || !time_options || time_options.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if recipient exists and is available
    const recipient = await pool.query(
      'SELECT id, status FROM users WHERE id = $1',
      [to_user_id]
    );

    if (recipient.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (recipient.rows[0].status === 'work grind don\'t hmu :(') {
      return res.status(400).json({ error: 'User is not accepting requests' });
    }

    const result = await pool.query(
      `INSERT INTO coffee_requests (from_user_id, to_user_id, location, time_options, message, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [req.user.user_id, to_user_id, location, JSON.stringify(time_options), message || '']
    );

    res.status(201).json({ request: result.rows[0] });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get requests
app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = `
      SELECT 
        r.*,
        json_build_object(
          'id', u_from.id,
          'name', u_from.name,
          'year', u_from.year,
          'avatar', u_from.avatar
        ) as "from",
        json_build_object(
          'id', u_to.id,
          'name', u_to.name,
          'year', u_to.year,
          'avatar', u_to.avatar
        ) as "to"
      FROM coffee_requests r
      JOIN users u_from ON r.from_user_id = u_from.id
      JOIN users u_to ON r.to_user_id = u_to.id
      WHERE (r.from_user_id = $1 OR r.to_user_id = $1)
    `;

    const params = [req.user.user_id];
    let paramCount = 1;

    if (type === 'sent') {
      query += ' AND r.from_user_id = $1';
    } else if (type === 'received') {
      query += ' AND r.to_user_id = $1';
    }

    if (status) {
      paramCount++;
      query += ` AND r.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Respond to request
app.put('/api/requests/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { accepted, response_message } = req.body;

    // Check if request exists and is for this user
    const request = await pool.query(
      'SELECT * FROM coffee_requests WHERE id = $1 AND to_user_id = $2',
      [req.params.id, req.user.user_id]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or not authorized' });
    }

    if (request.rows[0].status !== 'pending') {
      return res.status(400).json({ error: 'Request already responded to' });
    }

    const newStatus = accepted ? 'accepted' : 'declined';
    const result = await pool.query(
      `UPDATE coffee_requests 
       SET status = $1, response_message = $2, responded_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [newStatus, response_message || '', req.params.id]
    );

    res.json({ request: result.rows[0] });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== EVENT ENDPOINTS =====

// Create event
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, date, time, location, is_public } = req.body;

    if (!title || !description || !type || !date || !time || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO events (title, description, type, host_id, date, time, location, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, type, req.user.user_id, date, time, location, is_public !== false]
    );

    const event = result.rows[0];

    // Automatically add creator as attendee
    await pool.query(
      'INSERT INTO event_attendees (event_id, user_id) VALUES ($1, $2)',
      [event.id, req.user.user_id]
    );

    res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get events
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const { type, upcoming, my_events } = req.query;

    let query = `
      SELECT 
        e.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'year', u.year,
          'avatar', u.avatar
        ) as host,
        COUNT(DISTINCT ea.user_id) as attendees_count,
        EXISTS(
          SELECT 1 FROM event_attendees 
          WHERE event_id = e.id AND user_id = $1
        ) as is_attending
      FROM events e
      JOIN users u ON e.host_id = u.id
      LEFT JOIN event_attendees ea ON e.id = ea.event_id
      WHERE (e.is_public = true OR e.host_id = $1 OR EXISTS(
        SELECT 1 FROM event_attendees WHERE event_id = e.id AND user_id = $1
      ))
    `;

    const params = [req.user.user_id];
    let paramCount = 1;

    if (type) {
      paramCount++;
      query += ` AND e.type = $${paramCount}`;
      params.push(type);
    }

    if (upcoming === 'true') {
      query += ' AND e.date >= CURRENT_DATE';
    }

    query += ' GROUP BY e.id, u.id';

    if (my_events === 'true') {
      query += ' HAVING EXISTS(SELECT 1 FROM event_attendees WHERE event_id = e.id AND user_id = $1)';
    }

    query += ' ORDER BY e.date ASC, e.time ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific event
app.get('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const eventResult = await pool.query(
      `SELECT 
        e.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'year', u.year,
          'avatar', u.avatar
        ) as host
       FROM events e
       JOIN users u ON e.host_id = u.id
       WHERE e.id = $1`,
      [req.params.id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const attendeesResult = await pool.query(
      `SELECT u.id, u.name, u.year, u.avatar
       FROM event_attendees ea
       JOIN users u ON ea.user_id = u.id
       WHERE ea.event_id = $1`,
      [req.params.id]
    );

    const event = eventResult.rows[0];
    event.attendees = attendeesResult.rows;

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join event
app.post('/api/events/:id/join', authenticateToken, async (req, res) => {
  try {
    // Check if event exists
    const event = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already attending
    const existing = await pool.query(
      'SELECT * FROM event_attendees WHERE event_id = $1 AND user_id = $2',
      [req.params.id, req.user.user_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already attending this event' });
    }

    await pool.query(
      'INSERT INTO event_attendees (event_id, user_id) VALUES ($1, $2)',
      [req.params.id, req.user.user_id]
    );

    res.json({ message: 'Successfully joined event' });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Leave event
app.delete('/api/events/:id/leave', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not attending this event' });
    }

    res.json({ message: 'Successfully left event' });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event (host only)
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await pool.query(
      'SELECT * FROM events WHERE id = $1 AND host_id = $2',
      [req.params.id, req.user.user_id]
    );

    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or not authorized' });
    }

    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== HEALTH CHECK =====

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 M&T Community Platform server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});
