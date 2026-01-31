# M&T Community Platform - Backend API Documentation

## Tech Stack Recommendations

### Backend
- **Framework**: Node.js with Express.js OR Python with FastAPI
- **Database**: PostgreSQL (for relational data) + Redis (for caching)
- **Authentication**: JWT tokens with refresh tokens
- **File Storage**: AWS S3 or Cloudinary (for avatar images if needed)
- **Real-time**: Socket.io (for live notifications)

### Deployment
- **Backend**: Railway, Render, or AWS
- **Frontend**: Vercel or Netlify
- **Database**: Supabase or Railway PostgreSQL

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL, -- e.g., "M&T 2025"
    bio TEXT,
    status VARCHAR(50) DEFAULT 'available', -- 'available' or 'work grind don't hmu :('
    avatar JSONB NOT NULL, -- Store avatar configuration
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_year ON users(year);
```

### Coffee Requests Table
```sql
CREATE TABLE coffee_requests (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL,
    time_options JSONB NOT NULL, -- Array of time strings
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
    response_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP
);

CREATE INDEX idx_requests_to_user ON coffee_requests(to_user_id);
CREATE INDEX idx_requests_from_user ON coffee_requests(from_user_id);
CREATE INDEX idx_requests_status ON coffee_requests(status);
```

### Events Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'coffee', 'meal', 'study', 'activity', 'hangout'
    host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_host ON events(host_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_public ON events(is_public);
```

### Event Attendees Table
```sql
CREATE TABLE event_attendees (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_attendees_user ON event_attendees(user_id);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'coffee_request', 'request_accepted', 'event_invite', etc.
    content JSONB NOT NULL, -- Flexible data for different notification types
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

---

## API Endpoints

### Authentication

#### POST /api/auth/signup
Create new user account
```json
Request:
{
  "email": "sarah@upenn.edu",
  "password": "securepassword123",
  "name": "Sarah Chen",
  "year": "M&T 2025",
  "bio": "Love coffee chats!"
}

Response (201):
{
  "user": {
    "id": 1,
    "email": "sarah@upenn.edu",
    "name": "Sarah Chen",
    "year": "M&T 2025",
    "avatar": {...},
    "status": "available"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
Login user
```json
Request:
{
  "email": "sarah@upenn.edu",
  "password": "securepassword123"
}

Response (200):
{
  "user": {...},
  "token": "jwt_token_here"
}
```

#### POST /api/auth/refresh
Refresh JWT token
```json
Request:
{
  "refreshToken": "refresh_token_here"
}

Response (200):
{
  "token": "new_jwt_token"
}
```

---

### Users

#### GET /api/users
Get all users (community members)
```
Headers: Authorization: Bearer <token>

Query params:
- year: Filter by year (optional)
- status: Filter by status (optional)

Response (200):
[
  {
    "id": 1,
    "name": "Sarah Chen",
    "year": "M&T 2025",
    "avatar": {...},
    "status": "available",
    "bio": "Love coffee chats!"
  },
  ...
]
```

#### GET /api/users/:id
Get specific user profile
```
Response (200):
{
  "id": 1,
  "name": "Sarah Chen",
  "year": "M&T 2025",
  "avatar": {...},
  "status": "available",
  "bio": "Love coffee chats!"
}
```

#### PUT /api/users/:id
Update user profile (own profile only)
```json
Request:
{
  "bio": "Updated bio",
  "status": "work grind don't hmu :(",
  "avatar": {...}
}

Response (200):
{
  "user": {...updated user object}
}
```

---

### Coffee Requests

#### POST /api/requests
Send coffee request
```json
Request:
{
  "to_user_id": 2,
  "location": "Saxbys @ Huntsman",
  "time_options": ["Tomorrow 3pm", "Friday 2pm", "Monday 4pm"],
  "message": "Would love to chat about startups!"
}

Response (201):
{
  "request": {
    "id": 1,
    "from_user_id": 1,
    "to_user_id": 2,
    "location": "Saxbys @ Huntsman",
    "time_options": [...],
    "message": "Would love to chat about startups!",
    "status": "pending",
    "created_at": "2026-01-31T10:00:00Z"
  }
}
```

#### GET /api/requests
Get all requests (sent + received)
```
Query params:
- type: 'sent' or 'received' (optional)
- status: 'pending', 'accepted', 'declined' (optional)

Response (200):
[
  {
    "id": 1,
    "from": {...user object},
    "to": {...user object},
    "location": "Saxbys @ Huntsman",
    "time_options": [...],
    "message": "Would love to chat!",
    "status": "pending",
    "created_at": "2026-01-31T10:00:00Z"
  },
  ...
]
```

#### PUT /api/requests/:id/respond
Respond to coffee request
```json
Request:
{
  "accepted": true,
  "response_message": "Sounds great! Let's do tomorrow at 3pm"
}

Response (200):
{
  "request": {...updated request object}
}
```

---

### Events

#### POST /api/events
Create new event
```json
Request:
{
  "title": "Coffee & Code",
  "description": "Casual coding session with coffee!",
  "type": "coffee",
  "date": "2026-02-05",
  "time": "15:00",
  "location": "Saxbys @ Huntsman",
  "is_public": true
}

Response (201):
{
  "event": {
    "id": 1,
    "title": "Coffee & Code",
    "description": "Casual coding session with coffee!",
    "type": "coffee",
    "host_id": 1,
    "host": {...user object},
    "date": "2026-02-05",
    "time": "15:00",
    "location": "Saxbys @ Huntsman",
    "is_public": true,
    "attendees_count": 1,
    "created_at": "2026-01-31T10:00:00Z"
  }
}
```

#### GET /api/events
Get all events
```
Query params:
- type: Filter by event type (optional)
- upcoming: true/false (optional, default: true)
- my_events: true/false (show only events I'm attending)

Response (200):
[
  {
    "id": 1,
    "title": "Coffee & Code",
    "description": "Casual coding session with coffee!",
    "type": "coffee",
    "host": {...user object},
    "date": "2026-02-05",
    "time": "15:00",
    "location": "Saxbys @ Huntsman",
    "is_public": true,
    "attendees_count": 5,
    "is_attending": false
  },
  ...
]
```

#### GET /api/events/:id
Get specific event
```
Response (200):
{
  "id": 1,
  "title": "Coffee & Code",
  "host": {...user object},
  "attendees": [
    {...user object},
    {...user object}
  ],
  ...
}
```

#### POST /api/events/:id/join
Join event
```
Response (200):
{
  "message": "Successfully joined event",
  "event": {...updated event object}
}
```

#### DELETE /api/events/:id/leave
Leave event
```
Response (200):
{
  "message": "Successfully left event"
}
```

#### PUT /api/events/:id
Update event (host only)
```json
Request:
{
  "title": "Updated title",
  "description": "Updated description",
  ...
}

Response (200):
{
  "event": {...updated event object}
}
```

#### DELETE /api/events/:id
Delete event (host only)
```
Response (200):
{
  "message": "Event deleted successfully"
}
```

---

### Notifications

#### GET /api/notifications
Get user notifications
```
Query params:
- unread: true/false (optional)

Response (200):
[
  {
    "id": 1,
    "type": "coffee_request",
    "content": {
      "request_id": 5,
      "from_user": {...user object}
    },
    "is_read": false,
    "created_at": "2026-01-31T10:00:00Z"
  },
  ...
]
```

#### PUT /api/notifications/:id/read
Mark notification as read
```
Response (200):
{
  "message": "Notification marked as read"
}
```

#### PUT /api/notifications/read-all
Mark all notifications as read
```
Response (200):
{
  "message": "All notifications marked as read"
}
```

---

## Authentication & Security

### JWT Token Structure
```json
{
  "user_id": 1,
  "email": "sarah@upenn.edu",
  "exp": 1738368000
}
```

### Security Best Practices
1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **JWT Secret**: Store in environment variables, rotate regularly
3. **HTTPS Only**: Enforce HTTPS in production
4. **Rate Limiting**: Implement rate limiting on all endpoints
5. **Input Validation**: Validate and sanitize all user inputs
6. **CORS**: Configure CORS to only allow your frontend domain
7. **SQL Injection**: Use parameterized queries (ORMs handle this)

### Middleware Stack
```javascript
// Example Express middleware setup
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use('/api', authMiddleware); // JWT verification
```

---

## Real-time Features (Socket.io)

### Events to Emit
1. **new_coffee_request**: When someone sends you a coffee request
2. **request_response**: When someone responds to your request
3. **event_invitation**: When someone invites you to an event
4. **event_update**: When an event you're attending is updated

### Client Connection
```javascript
import io from 'socket.io-client';

const socket = io(BACKEND_URL, {
  auth: {
    token: jwt_token
  }
});

socket.on('new_coffee_request', (data) => {
  // Show notification
});
```

---

## Environment Variables

Create `.env` file:
```env
# Server
PORT=5001
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mt_community

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=another_secret_key
REFRESH_TOKEN_EXPIRES_IN=30d

# Frontend
FRONTEND_URL=https://your-frontend-url.com

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

---

## Deployment Steps

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy PostgreSQL database
5. Run migrations
6. Deploy backend service

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set environment variable: `REACT_APP_API_URL`
5. Deploy

### Quick Start Commands
```bash
# Backend
npm init -y
npm install express pg bcrypt jsonwebtoken cors helmet express-rate-limit socket.io dotenv

# Database setup
psql -U postgres
CREATE DATABASE mt_community;

# Run migrations (create tables from schema above)

# Start server
node server.js

# Frontend
npx create-react-app mt-community-frontend
cd mt-community-frontend
npm install lucide-react

# Copy the React component into src/App.js
# Update API_URL to point to your backend

npm start
```

---

## Additional Features to Consider

### Phase 2 Enhancements
- [ ] Email notifications for coffee requests
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Direct messaging between users
- [ ] Group chats for events
- [ ] Photo uploads for events
- [ ] Event RSVPs with "maybe" option
- [ ] Recurring events
- [ ] Search and filter users by interests
- [ ] User reputation/badges system
- [ ] Analytics dashboard for admins

### Gamification Ideas
- Points for attending events
- Streak tracking for regular meetups
- Badges (e.g., "Coffee Enthusiast", "Study Buddy", "Social Butterfly")
- Leaderboard for most active members
- Achievement unlocks

---

## Testing Recommendations

### Unit Tests
- User authentication flows
- Request creation and response
- Event CRUD operations
- Avatar customization logic

### Integration Tests
- API endpoint tests
- Database operations
- Real-time notifications

### E2E Tests
- Full user journey (signup → customize avatar → send request → create event)
- Use Playwright or Cypress

---

## Performance Optimization

1. **Database Indexes**: Already included in schema
2. **Caching**: Use Redis for frequently accessed data (user lists, event lists)
3. **Pagination**: Implement for events and requests lists
4. **Image Optimization**: Compress avatar images if storing them
5. **API Response Size**: Only return necessary fields
6. **Connection Pooling**: Configure PostgreSQL connection pool

---

## Support & Maintenance

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track user engagement metrics
- Database query performance

### Backup Strategy
- Daily database backups
- Store backups in separate location (S3)
- Test restore procedures monthly

This documentation provides everything you need to build and deploy your M&T Community Platform!
