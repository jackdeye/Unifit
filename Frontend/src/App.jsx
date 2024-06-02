import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Homepage from './Pages/Homepage';
import PostPage from './Pages/PostPage';
import Profile from './Pages/Profile';
import Login from './Pages/Login';
import Gallery from './Pages/Gallery';
import Favorites from './Pages/Favorites';
import NavBar from './Components/NavBar';
import EditProfile from './Pages/EditProfile';
import SignUp from './Pages/SignUp.jsx';
import ItemPage from './Pages/ItemPage';
import ProtectedRoute from './Components/ProtectedRoute';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EditPosts from './Pages/EditPosts.jsx'

export default function App() {
  //const theme = createTheme(themeData.schemes.light);
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#367765',
        light: '#5E9283',
        dark: '#255346',
      },
      secondary: {
        main: '#c84a5a',
        light: '#D36E7B',
        dark: '#8C333E',
      },
      error: {
        main: '#cc2b3c',
      },
    },
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [profile, setProfile] = useState(localStorage.getItem('profile') || '');
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        const timeUntilExpiration = decodedToken.exp - currentTime;

        if (timeUntilExpiration <= 0) {
          handleLogout();
        } else {
          const timeoutId = setTimeout(handleLogout, timeUntilExpiration * 1000);
          return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount or token change
        }
      } catch (error) {
        handleLogout(); // In case of any error in decoding the token
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (profile, token, profilePicture) => {
    localStorage.setItem('token', token);
    localStorage.setItem('profile', profile);
    localStorage.setItem('profilePicture', profilePicture || ''); // Set profile picture
    setIsAuthenticated(true);
    setProfile(profile);
    setProfilePicture(profilePicture || '');
    // Dispatch custom event
    const event = new Event('localStorageUpdated');
    window.dispatchEvent(event);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('profilePicture');
    setIsAuthenticated(false);
    setProfile('');
    setProfilePicture('');
    // Dispatch custom event
    const event = new Event('localStorageUpdated');
    window.dispatchEvent(event);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <BrowserRouter>
        <div style={{padding:5}}>
        <NavBar profile={profile} profilePicture={profilePicture} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/homepage" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Homepage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
          {/* <Route path="/gallery" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Gallery /></ProtectedRoute>} /> */}
          <Route path="/gallery" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Gallery /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Favorites /></ProtectedRoute>} />
          <Route path="/postpage" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PostPage /></ProtectedRoute>} />
          <Route path="/signup" element={<SignUp onSignup={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/editprofile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditProfile /></ProtectedRoute>} />
          <Route path="/item/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ItemPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="/edititem/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditPosts /></ProtectedRoute>} /> 
        </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
