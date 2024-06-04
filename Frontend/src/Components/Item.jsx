import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Item.css'; // Assuming you have a CSS file for styling

const Item = ({ product }) => {
  const [like, setLike] = useState(false);

  useEffect(() => {
    if (like === null) {
      setLike(false);
    }
  }, []);

  const handleLike = async () => {
    setLike(!like); 
    try {

      console.log(`set favorite to ${!like}`);
      const response = await fetch(`http://localhost:5050/post/${product._id}/likepost`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token in localStorage
        }
      });
      if (response.ok) {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];

        const result = await response.json();
        const isLiked = result.isLiked;

        if (isLiked) {
          //liked
          likedPosts.push(product._id); //PULL PRODUCT ID FROM LOCAL STORAGE WHEN UNLIKED >:(((((((((((((())))))))))))))
  
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
          console.log("liked post"); 
        } else {
          //unliked
          delete likedPosts[product._id];

          localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
          console.log("unliked post");
        }

      } else {
        alert("Failed to like post");
      }

  } catch(error) {
      console.error("Error on liking post");
      alert("error on liking post");
  }
  };

  const handleBuy = async () => {
    try {
      const response = await fetch(`http://localhost:5050/post/${product._id}/buy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token in localStorage
        }
      });
  
      if (response.ok) {
        alert('Item bought successfully!');
        
        // Fetch the current purchasedPosts from localStorage
        const purchasedPosts = JSON.parse(localStorage.getItem('purchasedPosts')) || [];
  
        // Append the new product ID to the array
        purchasedPosts.push(product._id);
  
        // Save the updated array back to localStorage
        localStorage.setItem('purchasedPosts', JSON.stringify(purchasedPosts));
  
        // handle post-purchase logic, eg, updating UI
      } else {
        console.error('Failed to buy the item');
      }
    } catch (error) {
      console.error('Error buying the item:', error);
    }
  };
  return (
    <div className="product-item">
      <Link to={`/item/${product._id}`}>
        <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
      <button
          className={`heart-button ${like ? 'liked' : ''}`}
          aria-label="Like"
          onClick={handleLike}
        >
          <span className="heart"></span>
        </button>
      <div className='product-interact'>
      <div className='button-container'>
          {product.isForSale && <button className="buy-button" onClick={handleBuy}>Buy</button>}
          {product.isForRent && (
            <Link to={`/item/${product._id}`} className="rent-button">
              Rent
            </Link>
          )}
        </div>
        <div className='price-info'>
          {product.isForSale && <p>Buy: ${product.buyPrice}</p>}
          {product.isForRent && <p>Rent: ${product.rentPrice}</p>}
        </div>
      </div>
    </div>
  );
};

export default Item;
