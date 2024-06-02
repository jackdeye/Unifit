import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Item.css'; // Assuming you have a CSS file for styling

const Item = ({ product }) => {
  const [like, setLike] = useState(false);
  // const [likedPost, setLikedPosts] = useState([]);
  // const [newLike, setNewLike] = useState('');

  const handleLike = async () => {
    setLike(!like);

    try {
      console.log(`set favorite to ${!like}`);

      const response = await fetch(`http://localhost:5050/post/${product._id}/likepost`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token in localStorage
        }
      });

      alert("fetched");

      if (response.ok) {
        // const likedPosts = [];
        // localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

        // const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
  
        // likedPosts.push(product._id);
  
        // localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        alert("liked post");

      } else {
        alert("Failed to like post");
      }

  } catch(error) {
      console.error("Error on liking post");
      alert("error on liking post");
  }
  };


  return (
    <div className="product-item">
      <Link to={`/item/${product._id}`}>
      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
      <h3>{product.name}</h3>
      </Link>
      <div className='product-interact'>
        <div className='price-info'>
        <p>Buy Price: {product.buyPrice}</p>
        <p>Rent Price: {product.rentPrice}</p>
        </div>
        <button
          className={`heart-button ${like ? 'liked' : ''}`}
          aria-label="Like"
          onClick={handleLike}
        >
          <span className="heart"></span>
        </button>
      </div>
    </div>
  );
};

export default Item;