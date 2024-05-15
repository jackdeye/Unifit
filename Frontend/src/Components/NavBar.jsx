import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/NavBar.css"


export default function Navbar() {
	return (
		<div className='navbar'>
			<h1><Link to="/homepage">Unifits</Link></h1>
      <div className='link-container'>
          <Link to="/homepage">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/postpage">Posts</Link>
      </div>
        <div className='button'>
          <Link to="/login">Login</Link>
        </div>
		</div>
	);
}
