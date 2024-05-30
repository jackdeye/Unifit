import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

export default function App() {
  //const theme = createTheme(themeData.schemes.light);
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#367765',
      },
      secondary: {
        main: '#c84a5a',
      },
      error: {
        main: '#cc2b3c',
      },
    },
  });
  console.log(theme);
  return (
    <BrowserRouter>
      {/* <h1>{message}</h1> */}
      <ThemeProvider theme={theme}>
        <NavBar/>
        <Checkbox defaultChecked />
        <Routes>
          <Route path="/homepage" element={<Homepage />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/postpage" element={<PostPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/" element={<Navigate to="/homepage" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
