import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import PostPage from './Pages/PostPage';
import Profile from './Pages/Profile';
import Login from './Pages/Login';
import Gallery from './Pages/Gallery';
import Favorites from './Pages/Favorites';
import NavBar from './Pages/Components/NavBar';

function App() {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:5050/update")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <BrowserRouter>
      {/* <h1>{message}</h1> */}
      <div>
        <NavBar />
        <Routes>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/postpage" element={<PostPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/homepage" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;