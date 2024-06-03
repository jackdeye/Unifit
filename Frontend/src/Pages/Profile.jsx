import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Profile.css";
import Item from '../Components/Item.jsx';
import {Avatar, Button} from '@mui/material';

export default function Profile() {
  const [products, setProducts] = useState([]);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [school] = useState(localStorage.getItem('school'));
  const navigate = useNavigate();

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
      const purchasedPosts = localStorage.getItem('purchasedPosts');
      let purchasedProductIds = [];
      if (purchasedPosts) {
        try {
          purchasedProductIds = JSON.parse(purchasedPosts);
        } catch (error) {
          console.error("Error parsing purchasedPosts:", error);
        }
      }
    
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

    const fetchPendingProducts = async () => {
      const pendingPosts = localStorage.getItem('pendingPosts');
      let pendingProductIds = [];
      if (pendingPosts) {
        try {
          pendingProductIds = JSON.parse(pendingPosts);
        } catch (error) {
          console.error("Error parsing pendingPosts:", error);
        }
      }
    
      if (pendingProductIds.length > 0) {
        try {
          const responses = await Promise.all(
            pendingProductIds.map(id => fetch(`http://localhost:5050/post/${id}`))
          );
          const data = await Promise.all(responses.map(res => res.json()));
          setPendingPosts(data);
        } catch (error) {
          console.error("Error fetching pending products:", error);
        }
      }
    };

    fetchProducts();
    fetchPurchasedProducts();
    fetchPendingProducts();
  }, []);

  const getProfileInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const handlePendingPurchasesClick = () => {
    navigate('/pending-purchases');
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
          <span className="username">@{localStorage.getItem("username")}</span>
        </h5>
      </div>

      <div className='all'>
        <div className='info'>
          <div>{school}</div>
          <div><Link to="/EditProfile">EditProfile</Link></div>
          <div><Link to="/postpage">Create Post</Link></div>
          {pendingPosts.length > 0 && (
          <Button variant="contained" onClick={handlePendingPurchasesClick}>
            Pending Purchases: {pendingPosts.length}
          </Button>
      )}
        </div>
        <div className='products'>
          <div className="products-gallery">
            <h2>Your Shop</h2>
            <div className="products-grid">
              {products.length === 0 ? (
                  <p>No items listed yet.</p>
                ) : (
                  products.map((product) => (
                    <Item key={product._id} product={product} sold={product.sold} />
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
