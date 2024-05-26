import React from 'react';
import '../styles/Homepage.css';
import { Link, useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();
  return (
    <div className="homepage">
      <div className='item'>
        <h1>Unifit</h1> 
        </div>
        <div className='item'>
        <p>
          blurb blurb blurb!!
        </p>
        </div>
        <div className='item'>
        <button className='browse-gallery' onClick={() => navigate('/gallery')}>
          Browse Collection
        </button>
        </div>
        <div className='item'>
        <p> Welcome back! To access your profile or view your saved favorites, log in below.</p>
          <p>New around here? Sign up below to create your account. </p>
          </div>
          <div className='item'>
        <div className="start-button-container">
        <button className="start-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="start-button" onClick={() => navigate('/signup')}>
          Sign up!
        </button>
        </div>
      </div>

    </div>
  );
};

export default Homepage;
