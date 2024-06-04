import React from 'react';
import '../styles/ParallaxSection.css';

const ParallaxSection = ({ image, children }) => {
  return (
    <div className="parallax-section" style={{ backgroundImage: `url(${image})`, marginTop:'50px', backgroundPosition:'center 50%' }}>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
