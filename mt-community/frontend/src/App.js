import React, { useState, useEffect } from 'react';
import { Coffee, Calendar, Users, Send, Check, X, Mail, Clock, MapPin, Sparkles, User, Settings, LogOut } from 'lucide-react';

// Add this right after the import statements and before any components
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Penguin Avatar Customizer Component
const PenguinAvatarCustomizer = ({ onSave, initialAvatar, isOpen, onClose }) => {
  const [avatar, setAvatar] = useState(initialAvatar || {
    bodyColor: '#2C3E50',
    bellyColor: '#FFFFFF',
    hatColor: '#E74C3C',
    hatStyle: 'beanie',
    accessory: 'none',
    eyeStyle: 'happy',
    beakColor: '#FF9800',
    backgroundColor: '#87CEEB'
  });

  const bodyColors = ['#2C3E50', '#34495E', '#1A1A2E', '#16213E'];
  const hatColors = ['#E74C3C', '#3498DB', '#9B59B6', '#F39C12', '#E91E63', '#00BCD4'];
  const hatStyles = [
    { id: 'beanie', name: 'Beanie' },
    { id: 'cap', name: 'Cap' },
    { id: 'tophat', name: 'Top Hat' },
    { id: 'none', name: 'None' }
  ];
  const accessories = [
    { id: 'none', name: 'None' },
    { id: 'scarf', name: 'Scarf' },
    { id: 'bowtie', name: 'Bow Tie' },
    { id: 'glasses', name: 'Glasses' }
  ];
  const eyeStyles = [
    { id: 'happy', name: 'Happy' },
    { id: 'cute', name: 'Cute' },
    { id: 'cool', name: 'Cool' }
  ];
  const backgroundColors = ['#87CEEB', '#FFE5B4', '#E8F5E9', '#FFF3E0', '#F3E5F5'];

  const updateAvatar = (key, value) => {
    setAvatar(prev => ({ ...prev, [key]: value }));
  };

  const renderPenguinHat = () => {
    const { hatStyle, hatColor } = avatar;
    const styles = {
      beanie: (
        <>
          <ellipse cx="100" cy="35" rx="28" ry="18" fill={hatColor} />
          <circle cx="100" cy="28" r="6" fill="#FFF" opacity="0.8" />
        </>
      ),
      cap: (
        <>
          <ellipse cx="100" cy="40" rx="30" ry="15" fill={hatColor} />
          <ellipse cx="130" cy="42" rx="18" ry="8" fill={hatColor} />
          <text x="95" y="45" fontSize="16" fontWeight="bold" fill="#FFF">M+T</text>
        </>
      ),
      tophat: (
        <>
          <rect x="80" y="25" width="40" height="25" fill={hatColor} rx="2" />
          <ellipse cx="100" cy="50" rx="35" ry="8" fill={hatColor} />
        </>
      ),
      none: null
    };
    return styles[hatStyle];
  };

  const renderPenguinEyes = () => {
    const styles = {
      happy: (
        <>
          <circle cx="85" cy="75" r="8" fill="#FFF" />
          <circle cx="87" cy="75" r="5" fill="#000" />
          <circle cx="115" cy="75" r="8" fill="#FFF" />
          <circle cx="117" cy="75" r="5" fill="#000" />
        </>
      ),
      cute: (
        <>
          <circle cx="85" cy="75" r="10" fill="#FFF" />
          <circle cx="88" cy="73" r="6" fill="#000" />
          <circle cx="89" cy="71" r="2" fill="#FFF" />
          <circle cx="115" cy="75" r="10" fill="#FFF" />
          <circle cx="118" cy="73" r="6" fill="#000" />
          <circle cx="119" cy="71" r="2" fill="#FFF" />
        </>
      ),
      cool: (
        <>
          <rect x="75" y="72" width="20" height="8" fill="#000" rx="4" />
          <rect x="105" y="72" width="20" height="8" fill="#000" rx="4" />
        </>
      )
    };
    return styles[avatar.eyeStyle];
  };

  const renderAccessory = () => {
    const { accessory, hatColor } = avatar;
    const accessories = {
      none: null,
      scarf: (
        <>
          <path d="M70,120 Q100,125 130,120" stroke={hatColor} strokeWidth="10" fill="none" />
          <path d="M68,120 L60,140" stroke={hatColor} strokeWidth="8" />
          <path d="M132,120 L140,140" stroke={hatColor} strokeWidth="8" />
        </>
      ),
      bowtie: (
        <>
          <path d="M85,115 L95,120 L85,125 Z" fill="#E74C3C" />
          <path d="M115,115 L105,120 L115,125 Z" fill="#E74C3C" />
          <circle cx="100" cy="120" r="4" fill="#C0392B" />
        </>
      ),
      glasses: (
        <>
          <circle cx="85" cy="75" r="12" fill="none" stroke="#000" strokeWidth="2.5" />
          <circle cx="115" cy="75" r="12" fill="none" stroke="#000" strokeWidth="2.5" />
          <line x1="97" y1="75" x2="103" y2="75" stroke="#000" strokeWidth="2.5" />
        </>
      )
    };
    return accessories[accessory];
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            color: '#FFF',
            fontSize: '2rem',
            fontWeight: '700',
            margin: 0
          }}>
            Customize Your Penguin
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#FFF'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          {/* Preview */}
          <div style={{
            background: avatar.backgroundColor,
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <svg width="200" height="220" viewBox="0 0 200 220">
              {/* Body */}
              <ellipse cx="100" cy="110" rx="45" ry="55" fill={avatar.bodyColor} />
              
              {/* Belly */}
              <ellipse cx="100" cy="120" rx="30" ry="40" fill={avatar.bellyColor} />
              
              {/* Wings/Flippers */}
              <ellipse cx="60" cy="110" rx="15" ry="35" fill={avatar.bodyColor} transform="rotate(-20 60 110)" />
              <ellipse cx="140" cy="110" rx="15" ry="35" fill={avatar.bodyColor} transform="rotate(20 140 110)" />
              
              {/* Feet */}
              <ellipse cx="85" cy="160" rx="12" ry="8" fill={avatar.beakColor} />
              <ellipse cx="115" cy="160" rx="12" ry="8" fill={avatar.beakColor} />
              
              {/* Head */}
              <circle cx="100" cy="65" r="35" fill={avatar.bodyColor} />
              
              {/* Hat */}
              {renderPenguinHat()}
              
              {/* Eyes */}
              {renderPenguinEyes()}
              
              {/* Beak */}
              <ellipse cx="100" cy="85" rx="8" ry="6" fill={avatar.beakColor} />
              
              {/* Accessory */}
              {renderAccessory()}
            </svg>
          </div>

          {/* Customization Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {/* Hat Style */}
            <div>
              <h4 style={{ color: '#FFF', marginBottom: '8px', fontSize: '0.95rem' }}>Hat Style</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {hatStyles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateAvatar('hatStyle', style.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: avatar.hatStyle === style.id ? '#FFF' : 'rgba(255,255,255,0.2)',
                      color: avatar.hatStyle === style.id ? '#667eea' : '#FFF',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Hat Color */}
            <div>
              <h4 style={{ color: '#FFF', marginBottom: '8px', fontSize: '0.95rem' }}>Hat Color</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                {hatColors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateAvatar('hatColor', color)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      border: avatar.hatColor === color ? '3px solid #FFF' : 'none',
                      background: color,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Eye Style */}
            <div>
              <h4 style={{ color: '#FFF', marginBottom: '8px', fontSize: '0.95rem' }}>Eyes</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {eyeStyles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateAvatar('eyeStyle', style.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: avatar.eyeStyle === style.id ? '#FFF' : 'rgba(255,255,255,0.2)',
                      color: avatar.eyeStyle === style.id ? '#667eea' : '#FFF',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <h4 style={{ color: '#FFF', marginBottom: '8px', fontSize: '0.95rem' }}>Accessories</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {accessories.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => updateAvatar('accessory', acc.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: avatar.accessory === acc.id ? '#FFF' : 'rgba(255,255,255,0.2)',
                      color: avatar.accessory === acc.id ? '#667eea' : '#FFF',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {acc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div>
              <h4 style={{ color: '#FFF', marginBottom: '8px', fontSize: '0.95rem' }}>Background</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {backgroundColors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateAvatar('backgroundColor', color)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      border: avatar.backgroundColor === color ? '3px solid #FFF' : 'none',
                      background: color,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onSave(avatar);
            onClose();
          }}
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #00F260 0%, #0575E6 100%)',
            color: '#FFF',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          Save Penguin
        </button>
      </div>
    </div>
  );
};

// Mini Penguin Avatar Display
const MiniPenguin = ({ avatar, size = 60 }) => {
  const renderHat = () => {
    if (avatar.hatStyle === 'none') return null;
    if (avatar.hatStyle === 'beanie') {
      return (
        <>
          <ellipse cx="50" cy="17.5" rx="14" ry="9" fill={avatar.hatColor} />
          <circle cx="50" cy="14" r="3" fill="#FFF" opacity="0.8" />
        </>
      );
    }
    if (avatar.hatStyle === 'cap') {
      return (
        <>
          <ellipse cx="50" cy="20" rx="15" ry="7.5" fill={avatar.hatColor} />
          <ellipse cx="65" cy="21" rx="9" ry="4" fill={avatar.hatColor} />
        </>
      );
    }
    return null;
  };

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110">
      <ellipse cx="50" cy="55" rx="22.5" ry="27.5" fill={avatar.bodyColor} />
      <ellipse cx="50" cy="60" rx="15" ry="20" fill={avatar.bellyColor} />
      <ellipse cx="30" cy="55" rx="7.5" ry="17.5" fill={avatar.bodyColor} transform="rotate(-20 30 55)" />
      <ellipse cx="70" cy="55" rx="7.5" ry="17.5" fill={avatar.bodyColor} transform="rotate(20 70 55)" />
      <ellipse cx="42.5" cy="80" rx="6" ry="4" fill={avatar.beakColor} />
      <ellipse cx="57.5" cy="80" rx="6" ry="4" fill={avatar.beakColor} />
      <circle cx="50" cy="32.5" r="17.5" fill={avatar.bodyColor} />
      {renderHat()}
      <circle cx="42.5" cy="37.5" r="4" fill="#FFF" />
      <circle cx="43.5" cy="37.5" r="2.5" fill="#000" />
      <circle cx="57.5" cy="37.5" r="4" fill="#FFF" />
      <circle cx="58.5" cy="37.5" r="2.5" fill="#000" />
      <ellipse cx="50" cy="42.5" rx="4" ry="3" fill={avatar.beakColor} />
    </svg>
  );
};

// Main App
const MTCommunityApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // login, signup, dashboard, profile
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [showCoffeeRequest, setShowCoffeeRequest] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

const [users, setUsers] = useState([]);
const [events, setEvents] = useState([]);
const [requests, setRequests] = useState([]);

// Add this useEffect to load users when logged in
useEffect(() => {
  const loadUsers = async () => {
    if (currentUser) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    }
  };

  loadUsers();
}, [currentUser]);

  // Authentication handlers
// Authentication handlers
const handleSignup = async (signupData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    
    // Set current user
    setCurrentUser(data.user);
    setView('dashboard');
    setShowAvatarCustomizer(true);
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed: ' + error.message);
  }
};

const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    
    // Set current user
    setCurrentUser(data.user);
    setView('dashboard');
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
};

  const handleSendCoffeeRequest = (requestData) => {
    const newRequest = {
      id: requests.length + 1,
      from: currentUser,
      to: selectedMember,
      ...requestData,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    setRequests([...requests, newRequest]);
    setShowCoffeeRequest(false);
    setSelectedMember(null);
  };

  const handleRequestResponse = (requestId, accepted, message) => {
    setRequests(requests.map(req =>
      req.id === requestId
        ? { ...req, status: accepted ? 'accepted' : 'declined', responseMessage: message }
        : req
    ));
  };

  // Login/Signup View
  if (view === 'login' || view === 'signup') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '20px'
      }}>
        <div style={{
          background: '#FFF',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <svg width="80" height="88" viewBox="0 0 100 110" style={{ margin: '0 auto 16px' }}>
              <ellipse cx="50" cy="55" rx="22.5" ry="27.5" fill="#E74C3C" />
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#FFFFFF" />
              <circle cx="50" cy="32.5" r="17.5" fill="#E74C3C" />
              <ellipse cx="50" cy="17.5" rx="14" ry="9" fill="#2C3E50" />
              <text x="36" y="21" fontSize="10" fontWeight="bold" fill="#FFF">M+T</text>
              <circle cx="42.5" cy="37.5" r="4" fill="#FFF" />
              <circle cx="43.5" cy="37.5" r="2.5" fill="#000" />
              <circle cx="57.5" cy="37.5" r="4" fill="#FFF" />
              <circle cx="58.5" cy="37.5" r="2.5" fill="#000" />
              <ellipse cx="50" cy="42.5" rx="4" ry="3" fill="#FF9800" />
            </svg>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              {view === 'login' ? 'Welcome Back!' : 'Join M&T Community'}
            </h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Connect, schedule, and hangout with M&Ts
            </p>
          </div>

          {view === 'signup' ? (
            <SignupForm onSubmit={handleSignup} onSwitchToLogin={() => setView('login')} />
          ) : (
            <LoginForm onSubmit={handleLogin} onSwitchToSignup={() => setView('signup')} />
          )}
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Navbar */}
      <nav style={{
        background: '#FFF',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            M&T Connect
          </h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <NavButton
              icon={<Users size={18} />}
              label="Community"
              active={view === 'dashboard'}
              onClick={() => setView('dashboard')}
            />
            <NavButton
              icon={<Calendar size={18} />}
              label="Events"
              active={view === 'events'}
              onClick={() => setView('events')}
            />
            <NavButton
              icon={<Mail size={18} />}
              label="Requests"
              active={view === 'requests'}
              badge={requests.filter(r => r.to.id === currentUser?.id && r.status === 'pending').length}
              onClick={() => setView('requests')}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setView('profile')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              borderRadius: '12px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            {currentUser && <MiniPenguin avatar={currentUser.avatar} size={40} />}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{currentUser?.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>{currentUser?.year}</div>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {view === 'dashboard' && (
          <CommunityView
            users={users}
            currentUser={currentUser}
            onSendRequest={(member) => {
              setSelectedMember(member);
              setShowCoffeeRequest(true);
            }}
          />
        )}

        {view === 'events' && (
          <EventsView
            events={events}
            currentUser={currentUser}
            onCreateEvent={() => setShowEventCreator(true)}
          />
        )}

        {view === 'requests' && (
          <RequestsView
            requests={requests.filter(r => r.to.id === currentUser?.id)}
            onRespond={handleRequestResponse}
          />
        )}

        {view === 'profile' && (
          <ProfileView
            user={currentUser}
            onEditAvatar={() => setShowAvatarCustomizer(true)}
            onUpdateStatus={(status) => setCurrentUser({ ...currentUser, status })}
            onLogout={() => {
              localStorage.removeItem('token');
              setCurrentUser(null);
              setView('login');
            }}
          />
        )}
      </div>

      {/* Modals */}
      {showAvatarCustomizer && (
        <PenguinAvatarCustomizer
          initialAvatar={currentUser.avatar}
          isOpen={showAvatarCustomizer}
          onClose={() => setShowAvatarCustomizer(false)}
          onSave={(avatar) => setCurrentUser({ ...currentUser, avatar })}
        />
      )}

      {showCoffeeRequest && selectedMember && (
        <CoffeeRequestModal
          member={selectedMember}
          onClose={() => {
            setShowCoffeeRequest(false);
            setSelectedMember(null);
          }}
          onSend={handleSendCoffeeRequest}
        />
      )}

      {showEventCreator && (
        <EventCreatorModal
          onClose={() => setShowEventCreator(false)}
          onCreate={(eventData) => {
            setEvents([...events, {
              id: events.length + 1,
              ...eventData,
              host: currentUser.name,
              hostId: currentUser.id,
              attendees: 1
            }]);
            setShowEventCreator(false);
          }}
        />
      )}
    </div>
  );
};

// Helper Components
const NavButton = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'none',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 20px',
      color: active ? '#FFF' : '#666',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.95rem',
      position: 'relative',
      transition: 'all 0.2s'
    }}
  >
    {icon}
    {label}
    {badge > 0 && (
      <span style={{
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        background: '#E74C3C',
        color: '#FFF',
        borderRadius: '12px',
        padding: '2px 6px',
        fontSize: '0.7rem',
        fontWeight: '700'
      }}>
        {badge}
      </span>
    )}
  </button>
);

const LoginForm = ({ onSubmit, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '0.95rem',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '0.95rem',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#FFF',
          fontSize: '1.05rem',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        Log In
      </button>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

const SignupForm = ({ onSubmit, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    year: '',
    bio: ''
  });

  const years = ['M&T 2024', 'M&T 2025', 'M&T 2026', 'M&T 2027', 'M&T 2028'];

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '0.95rem',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '0.95rem',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '0.95rem',
            boxSizing: 'border-box'
          }}
          required
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
          M&T Year
        </label>
        <select
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '0.95rem',
            boxSizing: 'border-box'
          }}
          required
        >
          <option value="">Select your year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
          Bio (optional)
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            minHeight: '80px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#FFF',
          fontSize: '1.05rem',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        Create Account
      </button>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Log in
        </button>
      </p>
    </form>
  );
};

const CommunityView = ({ users, currentUser, onSendRequest }) => {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333', margin: 0 }}>
          M&T Community
        </h2>
        <div style={{ color: '#666', fontSize: '0.95rem' }}>
          {users.length} members
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {users.filter(u => u.id !== currentUser?.id).map(user => (
          <div
            key={user.id}
            style={{
              background: '#FFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <MiniPenguin avatar={user.avatar} size={60} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#333', marginBottom: '4px' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.year}</div>
              </div>
            </div>

            {user.status === 'work grind don\'t hmu :(' ? (
              <div style={{
                background: '#FFF3E0',
                color: '#F57C00',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                🔥 {user.status}
              </div>
            ) : (
              <div style={{
                background: '#E8F5E9',
                color: '#2E7D32',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                ✨ Available for meetups
              </div>
            )}

            {user.bio && (
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
                {user.bio}
              </p>
            )}

            <button
              onClick={() => onSendRequest(user)}
              disabled={user.status === 'work grind don\'t hmu :('}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: user.status === 'work grind don\'t hmu :(' 
                  ? '#e0e0e0' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#FFF',
                fontWeight: '600',
                cursor: user.status === 'work grind don\'t hmu :(' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: user.status === 'work grind don\'t hmu :(' ? 0.5 : 1
              }}
            >
              <Coffee size={18} />
              Send Coffee Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsView = ({ events, currentUser, onCreateEvent }) => {
  const eventTypes = {
    coffee: { icon: <Coffee size={20} />, color: '#8B4513', bg: '#FFF3E0' },
    meal: { icon: '🍽️', color: '#E91E63', bg: '#FCE4EC' },
    study: { icon: '📚', color: '#3F51B5', bg: '#E8EAF6' },
    activity: { icon: '🎯', color: '#00BCD4', bg: '#E0F7FA' },
    hangout: { icon: '🎉', color: '#9C27B0', bg: '#F3E5F5' }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333', margin: 0 }}>
          Community Events
        </h2>
        <button
          onClick={onCreateEvent}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#FFF',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem'
          }}
        >
          <Sparkles size={18} />
          Create Event
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {events.map(event => {
          const typeInfo = eventTypes[event.type] || eventTypes.hangout;
          return (
            <div
              key={event.id}
              style={{
                background: '#FFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: event.isPublic ? '2px solid #E3F2FD' : '2px solid #FFF3E0'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: typeInfo.bg,
                  color: typeInfo.color,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {typeof typeInfo.icon === 'string' ? typeInfo.icon : typeInfo.icon}
                  {event.type}
                </div>
                <div style={{
                  background: event.isPublic ? '#E3F2FD' : '#FFF3E0',
                  color: event.isPublic ? '#1976D2' : '#F57C00',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {event.isPublic ? '🌍 PUBLIC' : '🔒 PRIVATE'}
                </div>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#333', marginBottom: '12px' }}>
                {event.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
                {event.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
                  <User size={16} />
                  <span>Hosted by <strong>{event.host}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
                  <Calendar size={16} />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
                  <Users size={16} />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #667eea',
                  background: '#FFF',
                  color: '#667eea',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Join Event
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RequestsView = ({ requests, onRespond }) => {
  const [responseMessage, setResponseMessage] = useState({});

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333', marginBottom: '24px' }}>
        Coffee Requests
      </h2>

      {requests.length === 0 ? (
        <div style={{
          background: '#FFF',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          color: '#666'
        }}>
          <Coffee size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem' }}>No pending requests</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map(request => (
            <div
              key={request.id}
              style={{
                background: '#FFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: request.status === 'pending' ? '2px solid #667eea' : '2px solid #e0e0e0'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <MiniPenguin avatar={request.from.avatar} size={60} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#333' }}>
                      {request.from.name}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                      {request.from.year}
                    </span>
                  </div>
                  <div style={{
                    background: request.status === 'pending' ? '#E3F2FD' : request.status === 'accepted' ? '#E8F5E9' : '#FFEBEE',
                    color: request.status === 'pending' ? '#1976D2' : request.status === 'accepted' ? '#2E7D32' : '#C62828',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                    {request.status === 'pending' ? '⏳ Pending' : request.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <MapPin size={16} />
                  <strong>Location:</strong> {request.location}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>
                  <strong>Time Options:</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {request.timeOptions.map((time, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#F5F5F5',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#333'
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              {request.message && (
                <div style={{
                  background: '#F5F5F5',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#666',
                  marginBottom: '16px',
                  fontStyle: 'italic'
                }}>
                  "{request.message}"
                </div>
              )}

              {request.status === 'pending' && (
                <>
                  <textarea
                    placeholder="Add a message (optional)"
                    value={responseMessage[request.id] || ''}
                    onChange={(e) => setResponseMessage({
                      ...responseMessage,
                      [request.id]: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '0.9rem',
                      marginBottom: '12px',
                      minHeight: '60px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => onRespond(request.id, true, responseMessage[request.id])}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #00F260 0%, #0575E6 100%)',
                        color: '#FFF',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Check size={18} />
                      Accept
                    </button>
                    <button
                      onClick={() => onRespond(request.id, false, responseMessage[request.id])}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #E74C3C',
                        background: '#FFF',
                        color: '#E74C3C',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <X size={18} />
                      Decline
                    </button>
                  </div>
                </>
              )}

              {request.status !== 'pending' && request.responseMessage && (
                <div style={{
                  background: request.status === 'accepted' ? '#E8F5E9' : '#FFEBEE',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#666',
                  fontStyle: 'italic',
                  marginTop: '12px'
                }}>
                  <strong>Your response:</strong> "{request.responseMessage}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileView = ({ user, onEditAvatar, onUpdateStatus, onLogout }) => {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        background: '#FFF',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'start', marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              background: user.avatar.backgroundColor,
              borderRadius: '20px',
              padding: '24px',
              display: 'inline-block'
            }}>
              <MiniPenguin avatar={user.avatar} size={120} />
            </div>
            <button
              onClick={onEditAvatar}
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <Settings size={20} />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
              {user.name}
            </h2>
            <div style={{ fontSize: '1.1rem', color: '#666', marginBottom: '16px' }}>
              {user.year}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Availability Status
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => onUpdateStatus('available')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: user.status === 'available' 
                      ? 'linear-gradient(135deg, #00F260 0%, #0575E6 100%)'
                      : '#f5f5f5',
                    color: user.status === 'available' ? '#FFF' : '#666',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✨ Available
                </button>
                <button
                  onClick={() => onUpdateStatus('work grind don\'t hmu :(')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: user.status === 'work grind don\'t hmu :(' 
                      ? 'linear-gradient(135deg, #F57C00 0%, #FF6F00 100%)'
                      : '#f5f5f5',
                    color: user.status === 'work grind don\'t hmu :(' ? '#FFF' : '#666',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔥 Work Grind
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontWeight: '600', color: '#333' }}>Bio</label>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {editing ? 'Save' : 'Edit'}
            </button>
          </div>
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                minHeight: '100px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          ) : (
            <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
              {bio || 'No bio yet'}
            </p>
          )}
        </div>

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '2px solid #E74C3C',
            background: '#FFF',
            color: '#E74C3C',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '1rem'
          }}
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
};

const CoffeeRequestModal = ({ member, onClose, onSend }) => {
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [timeOptions, setTimeOptions] = useState(['', '', '']);
  const [message, setMessage] = useState('');

  const locations = [
    'Saxbys @ Huntsman',
    'Starbucks @ 40th St',
    'Pret @ Walnut',
    'Joe Coffee',
    'Custom'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({
      location: location === 'Custom' ? customLocation : location,
      timeOptions: timeOptions.filter(t => t),
      message
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFF',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 }}>
            ☕ Send Coffee Request
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#666'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: '#F5F5F5',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <MiniPenguin avatar={member.avatar} size={50} />
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.05rem', color: '#333' }}>{member.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>{member.year}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
              required
            >
              <option value="">Select location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {location === 'Custom' && (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter custom location"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '0.95rem',
                  marginTop: '8px',
                  boxSizing: 'border-box'
                }}
                required
              />
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Time Options (3 suggestions)
            </label>
            {timeOptions.map((time, idx) => (
              <input
                key={idx}
                type="text"
                value={time}
                onChange={(e) => {
                  const newTimes = [...timeOptions];
                  newTimes[idx] = e.target.value;
                  setTimeOptions(newTimes);
                }}
                placeholder={`Option ${idx + 1}: e.g., Tomorrow 3pm`}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '0.95rem',
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
                required={idx < 1}
              />
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey! Would love to chat about..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                minHeight: '80px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                background: '#FFF',
                color: '#666',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#FFF',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Send size={18} />
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EventCreatorModal = ({ onClose, onCreate }) => {
  const [eventData, setEventData] = useState({
    title: '',
    type: 'coffee',
    date: '',
    time: '',
    location: '',
    description: '',
    isPublic: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(eventData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFF',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 }}>
            Create Event
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#666'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Event Title
            </label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              placeholder="Coffee & Code Session"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Event Type
            </label>
            <select
              value={eventData.type}
              onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="coffee">Coffee</option>
              <option value="meal">Meal</option>
              <option value="study">Study</option>
              <option value="activity">Activity</option>
              <option value="hangout">Hangout</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Date
              </label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Time
              </label>
              <input
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Location
            </label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              placeholder="Huntsman Hall"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Description
            </label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              placeholder="What's this event about?"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '0.95rem',
                minHeight: '80px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={eventData.isPublic}
                onChange={(e) => setEventData({ ...eventData, isPublic: e.target.checked })}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontWeight: '600', color: '#333' }}>
                Make this event public (visible to all M&T community)
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                background: '#FFF',
                color: '#666',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#FFF',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} />
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MTCommunityApp;
