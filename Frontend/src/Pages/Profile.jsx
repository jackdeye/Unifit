import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";
import cat from "../Assets/cat.jpg";
import Item from '../Components/Item.jsx';
import "../styles/Gallery.css";

export default function Profile() {
  const [products, setProducts] = useState([]);
  const [school] = useState(localStorage.getItem('school'));
  // const [picture] = useState(localStorage.getItem('profilePicture'));

  useEffect(() => {
    const fetchProducts = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          const response = await fetch(`http://localhost:5050/post/user/${username}`);
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            console.error("Error fetching user's products");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className='header'>
        <h1>
          <img src={cat} alt="Profile"/>
          My Profile
        </h1>
      </div>

      <div className='all'>
        <div className='info'>
          <div>{school}</div>
          <div><Link to="/EditProfile">EditProfile</Link></div>
          <div><Link to="/postpage">Create Post</Link></div>
        </div>

        <div className="products-gallery">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map((product) => (
              <Item key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
