# 🐧 M&T Community Platform

A gamified scheduling and meetup platform for the M&T (Management & Technology) program community at Penn, featuring customizable penguin avatars, coffee requests, and event management.

![M&T Community Platform](https://img.shields.io/badge/Status-Ready%20to%20Deploy-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🎨 Customizable Penguin Avatars
- Multiple hat styles (Beanie, Cap, Top Hat)
- 8+ color options for hats
- Different eye styles (Happy, Cute, Cool)
- Accessories (Scarf, Bow Tie, Glasses)
- Custom backgrounds

### ☕ Coffee Request System
- Send animated coffee requests with location and time options
- Accept/decline with one-line messages
- Toggle profile availability status
- "Work grind don't hmu :(" mode

### 📅 Event Management
- Create public or private events
- Multiple event types (Coffee, Meal, Study, Activity, Hangout)
- RSVP system with attendee tracking
- Event discovery and filtering

### 🎮 Gamification
- Community engagement
- Profile status indicators
- Real-time notifications
- Year-based filtering (M&T 2024, 2025, 2026, etc.)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mt-community-platform.git
cd mt-community-platform
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Set Up Database
```bash
# Create database
createdb mt_community

# Run migrations
psql -d mt_community -f database-migration.sql
```

#### Configure Environment Variables
Create a `.env` file in the backend directory:
```env
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://localhost:5432/mt_community

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### Start Backend Server
```bash
npm start
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Create React App
```bash
npx create-react-app mt-community-frontend
cd mt-community-frontend
```

#### Install Dependencies
```bash
npm install lucide-react
```

#### Add the Main Component
Copy `mt-penguin-app.jsx` to `src/App.js`

#### Configure API URL
Create `.env` in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

#### Update API Calls in App.js
Replace all API endpoint URLs with:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Example:
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

#### Start Frontend
```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
mt-community-platform/
├── backend/
│   ├── server.js                 # Express server
│   ├── database-migration.sql    # Database schema
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main React app (mt-penguin-app.jsx)
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

---

## 🔧 Configuration

### Database Configuration

The platform uses PostgreSQL with the following tables:
- `users` - User profiles and avatars
- `coffee_requests` - Meetup requests
- `events` - Community events
- `event_attendees` - Event RSVP tracking
- `notifications` - User notifications

See `database-migration.sql` for complete schema.

### Authentication

Uses JWT (JSON Web Tokens) for authentication:
- Access tokens expire in 7 days (configurable)
- Passwords hashed with bcrypt (10 salt rounds)
- Refresh token support for extended sessions

### Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- SQL injection prevention (parameterized queries)
- Password hashing with bcrypt
- JWT token validation

---

## 🌐 API Documentation

Complete API documentation available in `BACKEND_API_DOCS.md`

### Key Endpoints

#### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile

#### Coffee Requests
- `POST /api/requests` - Send request
- `GET /api/requests` - Get requests
- `PUT /api/requests/:id/respond` - Accept/decline

#### Events
- `POST /api/events` - Create event
- `GET /api/events` - List events
- `POST /api/events/:id/join` - Join event
- `DELETE /api/events/:id/leave` - Leave event

---

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Railway**
- Go to [Railway.app](https://railway.app)
- Connect your GitHub repository
- Add PostgreSQL database service
- Set environment variables
- Deploy!

3. **Run Migrations**
```bash
# Railway console
psql $DATABASE_URL -f database-migration.sql
```

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
```bash
cd frontend
npm install -g vercel
vercel
```

2. **Set Environment Variable**
In Vercel dashboard, add:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

3. **Deploy**
```bash
vercel --prod
```

---

## 🧪 Testing

### Test Credentials (Development)

After running the migration with sample data:
```
Email: sarah@upenn.edu
Password: password123 (update hash in migration file)

Email: james@upenn.edu
Password: password123
```

### Manual Testing Checklist

- [ ] User signup and login
- [ ] Avatar customization
- [ ] Profile status toggle
- [ ] Send coffee request
- [ ] Accept/decline request
- [ ] Create public event
- [ ] Create private event
- [ ] Join/leave event
- [ ] Filter users by year
- [ ] View community members

---

## 🛠️ Development

### Running in Development Mode

Backend with auto-reload:
```bash
npm install -g nodemon
nodemon server.js
```

Frontend with hot reload:
```bash
npm start
```

### Adding New Features

1. **Database Changes**
   - Add migration in `database-migration.sql`
   - Update API endpoints in `server.js`
   - Update frontend API calls

2. **New API Endpoints**
   - Add route in `server.js`
   - Add authentication middleware if needed
   - Document in `BACKEND_API_DOCS.md`

3. **UI Changes**
   - Update components in `App.js`
   - Add new state management
   - Update styling

---

## 📊 Database Management

### Backup Database
```bash
pg_dump mt_community > backup.sql
```

### Restore Database
```bash
psql mt_community < backup.sql
```

### Clear All Data
```bash
psql mt_community
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q
psql mt_community -f database-migration.sql
```

---

## 🔍 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql  # macOS
sudo service postgresql restart   # Linux
```

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5001 | xargs kill -9

# Or change port in .env file
PORT=5001
```

**CORS Errors**
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend is making requests to correct API URL
- Verify CORS middleware configuration

**JWT Token Errors**
- Check `JWT_SECRET` is set in `.env`
- Verify token is being sent in Authorization header
- Check token expiration time

---

## 🎯 Roadmap

### Phase 1 (Current)
- [x] User authentication
- [x] Penguin avatar customization
- [x] Coffee request system
- [x] Event creation and management
- [x] Profile status toggle

### Phase 2 (Planned)
- [ ] Real-time notifications with Socket.io
- [ ] Email notifications
- [ ] Direct messaging
- [ ] Calendar integration
- [ ] Photo uploads for events
- [ ] Search and filters

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Group chats
- [ ] Gamification badges
- [ ] Analytics dashboard
- [ ] Recurring events
- [ ] Location-based features

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- M&T Program at University of Pennsylvania
- Inspired by community building and gamification
- Built with React, Express, and PostgreSQL

---

## 📧 Support

For questions or support, please:
- Open an issue on GitHub
- Contact: your-email@upenn.edu

---

## 🎉 Credits

Built with ❤️ for the M&T Community

**Tech Stack:**
- Frontend: React, Lucide Icons
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: JWT, bcrypt
- Security: Helmet, CORS

---

Made with 🐧 by the M&T Community
