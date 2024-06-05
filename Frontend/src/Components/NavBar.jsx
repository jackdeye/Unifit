import React, { useState, useEffect, useContext } from 'react';
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
  Badge,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import {ColorModeContext} from '../App.jsx'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}


export default function Navbar({ profile, profilePicture, isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [localProfilePicture, setLocalProfilePicture] = useLocalStorage('profilePicture', profilePicture);
  const [name, setName] = useState(profile);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);

  const theme = useTheme();

  const colorMode = useContext(ColorModeContext);

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
      // Check for pending requests
      const pendingRequests = localStorage.getItem('pendingRequests');
      console.log("pendingRequests: ", pendingRequests);
      setHasPendingRequests(pendingRequests && JSON.parse(pendingRequests).length > 0);
      console.log("setHasPendingRequests", hasPendingRequests);
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
    {name: 'Gallery', location: '/gallery'},
    {name: 'Favorites', location: '/favorites'},
    {name: 'Post', location: '/postpage'},
  ];

  const settings = [ 'Profile', 'Requests', 'Logout' ];

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
            <Button key={item.name} href={item.location} sx={{     ':hover': {
      bgcolor: 'primary.light', // theme.palette.primary.main
      color: 'white',
    }, color: '#fff', marginRight: '5px' }}>
              {item.name}
            </Button>
          ))}
        </Box>
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <Divider/>
      {isAuthenticated ? (
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Badge color="error" variant="dot" invisible={!hasPendingRequests}>
                <Avatar alt="Profile" src={`data:image/jpeg;base64,${localProfilePicture}`}>{getProfileInitial(name)}</Avatar>
              </Badge>
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
                if (setting === "Profile") {
                  navigate('/profile');
                } else if (setting === "Requests") {
                  navigate('/requests');
                } else if (setting === "Logout") {
                  handleLogout();
                }
              }}>
                <Typography textAlign="center">{setting}</Typography>
                {setting === "Requests" && hasPendingRequests && (
                  <Badge color="error" variant="dot">
                    <span></span>
                  </Badge>
                )}
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

