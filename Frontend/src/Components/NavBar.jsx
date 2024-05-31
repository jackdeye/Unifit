import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/NavBar.css"
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  Divider,
  Avatar
} from '@mui/material';

export default function Navbar({ profile, isAuthenticated, onLogout }) {

  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture'));
  const [name, setName] = useState(profile);

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

  const pages = [
    {name: 'Profile', location: 'profile'},
    {name: 'Gallery', location: 'gallery'},
    {name: 'Favorites', location: 'favorites'},
    {name: 'Posts', location: 'postpage'},
  ];

  return (
    <AppBar position="static" sx={{borderRadius:5}}>
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="/homepage"
          sx={{
            mr: 2,
            display: { xs: 'flex' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          UNIFIT
        </Typography>
        <Divider/>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {pages.map((item) => (
            <Button key={item.name} href={item.location} sx={{ color: '#fff' }}>
              {item.name}
            </Button>
          ))}
        </Box>
        <Divider/>
      {isAuthenticated ? (
        <div className="profile-container">
          {profilePicture && profilePicture !== 'null' ? (
            <div onClick={() => navigate('/profile')}>
              <Avatar  alt="Profile" src={`data:image/jpeg;base64,${profilePicture}`}/>
            </div>
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
        <Button href="/login" variant="contained" color="secondary">Login</Button>
      )}
      </Toolbar>
    </Container>
  </AppBar>
  );
}
