import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Item.css'; // Assuming you have a CSS file for styling

const Item = ({ product, sold }) => {
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike(!like);
    console.log(`set favorite to ${!like}`);
    // const favorite = await fetch('http://localhost:5050/:id/likePost', {
    //   method: 'POST',
    //   body: formDataToSend
    // })
  };

  // const handleBuy = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5050/post/${product._id}/buy`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token in localStorage
  //       }
  //     });
  
  //     if (response.ok) {
  //       alert('Item bought successfully!');
        
  //       // Fetch the current purchasedPosts from localStorage
  //       const purchasedPosts = JSON.parse(localStorage.getItem('purchasedPosts')) || [];
  
  //       // Append the new product ID to the array
  //       purchasedPosts.push(product._id);
  
  //       // Save the updated array back to localStorage
  //       localStorage.setItem('purchasedPosts', JSON.stringify(purchasedPosts));
        
  //       localStorage.setItem('sold', true);
  
  //       // handle post-purchase logic, eg, updating UI
  //     } else {
  //       console.error('Failed to buy the item');
  //     }
  //   } catch (error) {
  //     console.error('Error buying the item:', error);
  //   }
  // };

  const handleBuyRequest = async () => {
    try {
      const response = await fetch(`http://localhost:5050/post/${product._id}/request`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        alert('Item requested successfully!');
        
        // Fetch the current pendingPosts from localStorage
        const pendingPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];
  
        // Append the new product ID to the array
        pendingPosts.push(product._id);
  
        // Save the updated array back to localStorage
        localStorage.setItem('pendingPosts', JSON.stringify(pendingPosts));
        
        localStorage.setItem('requested', true);
  
        // handle post-purchase logic, eg, updating UI
      } else {
        console.error('Failed to request the item');
      }
    } catch (error) {
      console.error('Error requesting the item:', error);
    }
  };

  const handleRent = () => {
    alert('Rent feature not implemented yet');
    // implement rent logic 
  };

  return (
    <div className="product-item">
      {sold && <div className="sold-overlay">SOLD</div>}
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
          {product.isForSale && <button className="buy-button" onClick={handleBuyRequest}>Buy</button>}
          {product.isForRent && <button className="rent-button" onClick={handleRent}>Rent</button>}
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