import { Link } from 'react-router-dom';
import "../styles/Profile.css"
import cat from "/Users/alyssaleung/CS35L/Unifit/Frontend/Subject.jpg"


export default function Profile() {
  return (
    <div>
      <div className='header'>
        <h1>
          <img src={cat} />
          My Profile</h1>
      </div>
      <div className='info'>
        <div>School</div>
        <div><Link to="/EditProfile">EditProfile</Link></div>
        <div><Link to="/postpage">Posts</Link></div>
      </div>

      <div className="cards">put card here</div>

    </div>
  );
}