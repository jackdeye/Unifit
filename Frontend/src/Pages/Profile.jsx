import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";
import cat from "../Assets/cat.jpg";
import Item from './Item.jsx';
import "../styles/Gallery.css";
import {Avatar} from '@mui/material';

export default function Profile() {
  const [products, setProducts] = useState([]);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [school] = useState(localStorage.getItem('school'));

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
    const fetchPurchasedProducts = async () => {
      const purchasedProductIds = JSON.parse(localStorage.getItem('purchasedPosts')) || [];
      if (purchasedProductIds.length > 0) {
        try {
          const responses = await Promise.all(
            purchasedProductIds.map(id => fetch(`http://localhost:5050/post/${id}`))
          );
          const data = await Promise.all(responses.map(res => res.json()));
          setPurchasedPosts(data);
        } catch (error) {
          console.error("Error fetching purchased products:", error);
        }
      }
    };

    fetchProducts();
    fetchPurchasedProducts();
  }, []);

  const getProfileInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div>
      <div className='header'>
      <div className="avatar-container">
          <Avatar 
            alt="Profile" 
            src={`data:image/jpeg;base64,${localStorage.getItem("profilePicture")}`}
            sx={{ width: 100, height: 100 }} // Adjust the size as needed
          >
            {getProfileInitial(localStorage.getItem("profile"))}
          </Avatar>
      </div>
        <h5>
          {/* <img
            src={`data:image/jpeg;base64,${localStorage.getItem("profilePicture")}`}
            alt="Profile"
            className="profile-picture"
          /> */}
          <span className="username">@{localStorage.getItem("username")}</span>
        </h5>
      </div>

      <div className='all'>
        <div className='info'>
          <div>{school}</div>
          <div><Link to="/EditProfile">EditProfile</Link></div>
          <div><Link to="/postpage">Create Post</Link></div>
        </div>
        <div className='products'>
          <div className="products-gallery">
            <h2>Your Shop</h2>
            <div className="products-grid">
              {products.length === 0 ? (
                  <p>No items listed yet.</p>
                ) : (
                  products.map((product) => (
                    <Item key={product._id} product={product} />
                  ))
              )}
            </div>
          </div>
          <div className="products-gallery">
            <h2>Purchases</h2>
            <div className="products-grid">
              {purchasedPosts.length === 0 ? (
                  <p>No items bought yet.</p>
                ) : (
                  purchasedPosts.map((product) => (
                    <Item key={product._id} product={product} />
                  ))
              )}
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}
