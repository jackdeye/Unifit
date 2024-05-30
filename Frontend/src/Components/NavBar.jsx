import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import "../styles/NavBar.css";

export default function Navbar({ profile, isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture'));
  const [name, setName] = useState(localStorage.getItem('profile'));

  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to login page
  };

  const getProfileInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setProfilePicture(localStorage.getItem('profilePicture'));
      setName(localStorage.getItem('profile'));
    };

    window.addEventListener('localStorageUpdated', handleStorageChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, []);

  return (
    <div className='navbar'>
      <h1><Link to="/homepage">Unifits</Link></h1>
      <div className='link-container'>
        <Link to="/homepage">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/postpage">Posts</Link>
      </div>
      {isAuthenticated ? (
        <div className="profile-container">
          {profilePicture && profilePicture !== 'null' ? (
            <img
              src={`data:image/jpeg;base64,${profilePicture}`}
              alt="Profile"
              className="profile-picture"
              onClick={() => navigate('/profile')}
            />
          ) : (
            <div
              className="profile-initial"
              onClick={() => navigate('/profile')}
            >
              {getProfileInitial(name)}
            </div>
          )}
          <h5 className='button'>Welcome, {name}</h5> {/* Changed profile to name */}
          <h5><button onClick={handleLogout}>Logout</button></h5>
        </div>
      ) : (
        <div className='button'>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
}
