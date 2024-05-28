import { useState, useEffect } from 'react'
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [profile, setProfile] = useState(localStorage.getItem('profile') || '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      console.log("decodedToken.exp: ", decodedToken.exp);
      console.log("currentTime: ", currentTime);
      const timeUntilExpiration = decodedToken.exp - currentTime;
      console.log("time until expiration", timeUntilExpiration);
      
      if (timeUntilExpiration <= 0) {
        handleLogout();
      } else {
        const timeoutId = setTimeout(handleLogout, timeUntilExpiration * 1000);
        return () => clearTimeout(timeoutId); // cleanup timeout on component unmount or token change
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (profile, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('profile', profile);
    setIsAuthenticated(true);
    setProfile(profile);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    setIsAuthenticated(false);
    setProfile('');
  };

  return (
    <BrowserRouter>
      <div>
        <NavBar profile={profile} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/homepage" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Homepage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Gallery /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Favorites /></ProtectedRoute>} />
          <Route path="/postpage" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PostPage /></ProtectedRoute>} />
          <Route path="/signup" element={<SignUp onSignup={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/editprofile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditProfile /></ProtectedRoute>} />
          <Route path="/item/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ItemPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/homepage" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
