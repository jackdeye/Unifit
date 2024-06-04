import React from 'react';
import ParallaxSection from '../Components/ParallaxSection';
import '../styles/Homepage.css';
import image1 from '../Assets/Yoink2.jpg';
import image2 from '../Assets/Yoink3.jpg';

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
    <h3 className="mission-statement">
      Unifit: a platform that allows university students to effortlessly buy, sell, and rent clothes
      or other dorm necessities on campus without the hassle of shipping over an item from a stranger.
      Our goal is to fight against fast fashion, promote sustainability, and cultivate a close-knit community
      on university campuses.
    </h3>
    <ParallaxSection image={image2}>
      <h1>Find Your clothes, in Your Community</h1>
    </ParallaxSection>
    <div className='item'>
      <p>Welcome back! To access your profile or view your saved favorites, log in below.</p>
      <p>New around here? Sign up below to create your account.</p>
    </div>
    <p className="footer">UCLA Spring '24 CS 35L project.</p>
  </div>
);

export default Homepage;

