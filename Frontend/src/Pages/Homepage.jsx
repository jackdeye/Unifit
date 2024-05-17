import { Link } from 'react-router-dom';
function Homepage() {
  return (
    <div className="Homepage">
      <header className="UniFit-Home">
        
        <h1 className="title">Unifit</h1> 
        <p>
          Lets get Started!
        </p>
        <button><Link to="/Gallery">Gallery</Link></button>
      </header>
    </div>
  );
}
  export default Homepage;