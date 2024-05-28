import { Link, useNavigate } from 'react-router-dom';
import "../styles/NavBar.css"


export default function Navbar({ profile, isAuthenticated, onLogout}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');  // Redirect to login page
  };

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
      {isAuthenticated ? (
        <div className='button'>
          <h5>Welcome, {profile}</h5>
          <h5><button onClick={handleLogout}>Logout</button></h5>
        </div>
      ) : (
        <div className='button'>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
}
