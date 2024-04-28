import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/homepage">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        <li><Link to="/postpage">Posts</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;