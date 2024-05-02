import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <nav>
      <ul>
        <li><Link to="/EditProfile">EditProfile</Link></li>
      </ul>
    </nav>
  );
}