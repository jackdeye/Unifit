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
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';

export default function Navbar({ profile, profilePicture, isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [localProfilePicture, setLocalProfilePicture] = useState(profilePicture);
  const [name, setName] = useState(profile);

  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to login page
    // Dispatch custom event
    const event = new Event('localStorageUpdated');
    window.dispatchEvent(event);
  };

  const getProfileInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setLocalProfilePicture(localStorage.getItem('profilePicture'));
      setName(localStorage.getItem('profile'));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleStorageChange);

    handleStorageChange();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const pages = [
    {name: 'Gallery', location: 'gallery'},
    {name: 'Favorites', location: 'favorites'},
    {name: 'Posts', location: 'postpage'},
  ];

  const settings = [ 'Profile', 'Logout' ];

  useEffect(() => {
    setLocalProfilePicture(profilePicture);
    setName(profile);
  }, [profilePicture, profile]);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


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
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar  alt="Profile" src={`data:image/jpeg;base64,${profilePicture}`}>{getProfileInitial(name)}</Avatar>
          </IconButton>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={ () => {
                handleCloseUserMenu();
                if(setting === "Profile") {
                  navigate('/profile');
                } else if (setting === "Logout") {
                  handleLogout();
                }
              }}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ) : (
        <Button href="/login" variant="contained" color="secondary">Login</Button>
      )}
      </Toolbar>
    </Container>
  </AppBar>
  );
}
            //<div onClick={() => navigate('/profile')}>

