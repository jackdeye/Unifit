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

export default function App() {
  return (
    <BrowserRouter>
      {/* <h1>{message}</h1> */}
      <div>
        <NavBar/>
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
      </div>
    </BrowserRouter>
  );
}
