import React from 'react';
import ParallaxSection from '../Components/ParallaxSection';
import '../styles/Homepage.css';
import image1 from '../Assets/Yoink2.jpg';
import image2 from '../Assets/Yoink3.jpg';

const isLoggedIn = !!localStorage.getItem('token');

const Homepage = () => (
  <div>
    <ParallaxSection image={image1}>
      <h1>Welcome to <span className="highlight">UNIFIT</span></h1>
      <p>Swap Sustainably</p>
    </ParallaxSection>
    <div className='item'>
      <div className="button-container">
        <button className="button" onClick={() => navigate('/gallery')}>
          Browse Collection
        </button>
      </div>
      {!isLoggedIn &&<div className='item'>
        <div className="start-button-container">
          <button className="start-button" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="start-button" onClick={() => navigate('/signup')}>
            Sign up!
          </button>
        </div>
      </div>}
    </div>
    <div className="mission-statement">
      <p>A platform that allows university students to effortlessly buy, sell, and rent clothes </p>
      <p><span style={{textDecoration: "underline"}}>without</span> the hassle of shipping over an item from a stranger.</p>
      <p>Our goal is to:</p>
      <ul>
        <li>Fight against fast fashion</li>
        <li>Promote sustainability</li>
        <li>Cultivate a close-knit community on university campuses</li>
      </ul>
    </div>
    <ParallaxSection image={image2}>
      <h1>Find Your clothes, in Your Community</h1>
    </ParallaxSection>
    <p className="footer">UCLA Spring '24 CS 35L project</p>
  </div>
);

export default Homepage;

