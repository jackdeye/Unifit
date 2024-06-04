import React from 'react';
import ParallaxSection from '../Components/ParallaxSection';
import image1 from '../Assets/Yoink2.jpg';
import image2 from '../Assets/Yoink3.jpg';

function Homepage() {
  return (
    <div>
      <ParallaxSection image={image1}>
        <h1>Welcome to <span style={{ color: "#367765" }}>Unifit</span></h1>
        <p>Swap Sustainably</p>
      </ParallaxSection>
      <h3>Unifit: a platform that allows university students to effortlessly buy, sell, and rent clothes
        or other dorm necessities on campus without the hassle of shipping over an item from a stranger.
        Our goal is to fight against fast fashion, promote sustainability, and cultivate a close-knit community
        on university campuses.</h3>
      <div style={{ backgroundImage: `url(${image2})`, backgroundSize: 'cover', height: '500px' }}>
        <h1>Section 2</h1>
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
      <p>More content here. You can add more parallax sections as needed.</p>
    </div>
  );
}

export default Homepage;

