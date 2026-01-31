-- M&T Community Platform - Database Migration
-- Run this file to create all necessary tables

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL,
    bio TEXT DEFAULT '',
    status VARCHAR(50) DEFAULT 'available',
    avatar JSONB NOT NULL DEFAULT '{"bodyColor":"#2C3E50","bellyColor":"#FFFFFF","hatColor":"#E74C3C","hatStyle":"beanie","accessory":"none","eyeStyle":"happy","beakColor":"#FF9800","backgroundColor":"#87CEEB"}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_year ON users(year);
CREATE INDEX idx_users_status ON users(status);

-- Coffee Requests Table
CREATE TABLE coffee_requests (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL,
    time_options JSONB NOT NULL,
    message TEXT DEFAULT '',
    status VARCHAR(50) DEFAULT 'pending',
    response_message TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP,
    CONSTRAINT check_not_self_request CHECK (from_user_id != to_user_id)
);

-- Create indexes for coffee_requests table
CREATE INDEX idx_requests_to_user ON coffee_requests(to_user_id);
CREATE INDEX idx_requests_from_user ON coffee_requests(from_user_id);
CREATE INDEX idx_requests_status ON coffee_requests(status);
CREATE INDEX idx_requests_created_at ON coffee_requests(created_at DESC);

-- Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT check_valid_event_type CHECK (type IN ('coffee', 'meal', 'study', 'activity', 'hangout'))
);

-- Create indexes for events table
CREATE INDEX idx_events_host ON events(host_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_public ON events(is_public);
CREATE INDEX idx_events_type ON events(type);

-- Event Attendees Table
CREATE TABLE event_attendees (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create indexes for event_attendees table
CREATE INDEX idx_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_attendees_user ON event_attendees(user_id);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT check_valid_notification_type CHECK (
        type IN ('coffee_request', 'request_accepted', 'request_declined', 'event_invite', 'event_update', 'new_attendee')
    )
);

-- Create indexes for notifications table
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional - remove in production)

-- Sample Users
INSERT INTO users (email, password_hash, name, year, bio, avatar, status) VALUES
('sarah@upenn.edu', '$2b$10$YourHashedPasswordHere', 'Sarah Chen', 'M&T 2025', 'Love coffee chats and discussing startups!', 
'{"bodyColor":"#2C3E50","bellyColor":"#FFFFFF","hatColor":"#E74C3C","hatStyle":"beanie","accessory":"scarf","eyeStyle":"happy","beakColor":"#FF9800","backgroundColor":"#87CEEB"}', 'available'),

('james@upenn.edu', '$2b$10$YourHashedPasswordHere', 'James Liu', 'M&T 2026', 'Always down for study sessions',
'{"bodyColor":"#34495E","bellyColor":"#FFFFFF","hatColor":"#3498DB","hatStyle":"cap","accessory":"glasses","eyeStyle":"cool","beakColor":"#FF9800","backgroundColor":"#E8F5E9"}', 'available'),

('maya@upenn.edu', '$2b$10$YourHashedPasswordHere', 'Maya Patel', 'M&T 2024', 'Finals week mode 📚',
'{"bodyColor":"#2C3E50","bellyColor":"#FFFFFF","hatColor":"#9B59B6","hatStyle":"tophat","accessory":"bowtie","eyeStyle":"cute","beakColor":"#FF9800","backgroundColor":"#FFE5B4"}', 'work grind don''t hmu :(');

-- Sample Events
INSERT INTO events (title, description, type, host_id, date, time, location, is_public) VALUES
('Coffee & Code', 'Casual coding session with coffee!', 'coffee', 1, '2026-02-05', '15:00:00', 'Saxbys @ Huntsman', true),
('M&T Dinner Meetup', 'Monthly dinner to connect across years', 'meal', 2, '2026-02-07', '18:30:00', 'Houston Market', true),
('Study Group - CIS 120', 'Final exam prep session', 'study', 1, '2026-02-10', '14:00:00', 'Van Pelt Library', true);

-- Sample Event Attendees
INSERT INTO event_attendees (event_id, user_id) VALUES
(1, 1), (1, 2),
(2, 2), (2, 1),
(3, 1);

-- Create a view for easy event querying with host and attendee info
CREATE VIEW events_with_details AS
SELECT 
    e.id,
    e.title,
    e.description,
    e.type,
    e.date,
    e.time,
    e.location,
    e.is_public,
    e.created_at,
    json_build_object(
        'id', u.id,
        'name', u.name,
        'year', u.year,
        'avatar', u.avatar
    ) as host,
    COUNT(ea.user_id) as attendees_count
FROM events e
JOIN users u ON e.host_id = u.id
LEFT JOIN event_attendees ea ON e.id = ea.event_id
GROUP BY e.id, u.id;

-- Create a function to clean up old notifications (optional)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications 
    WHERE is_read = true 
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust based on your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;

-- Verification queries (run these to check if everything is set up correctly)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM users;
-- SELECT * FROM events_with_details;

COMMENT ON TABLE users IS 'Stores M&T community member profiles';
COMMENT ON TABLE coffee_requests IS 'Stores coffee/meetup requests between users';
COMMENT ON TABLE events IS 'Stores community events';
COMMENT ON TABLE event_attendees IS 'Tracks which users are attending which events';
COMMENT ON TABLE notifications IS 'Stores user notifications';
