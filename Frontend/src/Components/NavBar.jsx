import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import "../styles/NavBar.css"


export default function Navbar() {
	const isAuthed = useSelector((state) => state.auth.value)
  {/*const dispatch = useDispatch()*/}
  return (
		<div className='navbar'>
			<h1><Link to="/homepage">Unifit</Link></h1>
      <div className='link-container'>
          <Link to="/homepage">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/postpage">Posts</Link>
          {isAuthed ? (
            <p>User is authenticated!</p>
            ) : (
            <p>User is not authenticated.</p>
          )}
      </div>
        <div className='button'>
          <Link to="/login">Login</Link>
        </div>
		</div>
	);
}
