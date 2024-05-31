import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Item.css'; // Assuming you have a CSS file for styling

const Item = ({ product }) => {
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike(!like);
    console.log(`set favorite to ${!like}`);
    // const favorite = await fetch('http://localhost:5050/:id/likePost', {
    //   method: 'POST',
    //   body: formDataToSend
    // })
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
        // handle post-purchase logic, eg, updating UI
      } else {
        console.error('Failed to buy the item');
      }
    } catch (error) {
      console.error('Error buying the item:', error);
    }
  };

  const handleRent = () => {
    alert('Rent feature not implemented yet');
    // implement rent logic 
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
        <div className='button-container'>
          {product.isForSale && <button className="buy-button" onClick={handleBuy}>Buy</button>}
          {product.isForRent && <button className="rent-button" onClick={handleRent}>Rent</button>}
        <button
          className={`heart-button ${like ? 'liked' : ''}`}
          aria-label="Like"
          onClick={handleLike}
        >
          <span className="heart"></span>
        </button>
        </div>
      </div>
    </div>
  );
};

export default Item;