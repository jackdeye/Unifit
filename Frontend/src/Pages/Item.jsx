import React from 'react';
import '../styles/Item.css'; // Assuming you have a CSS file for styling
import { useState } from "react";

const Item = ({ product }) => {
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike(!like);
    console.log(`set favorite to ${!like}`);
  };


  return (
    <div className="product-item">
      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Buy Price: {product.buyPrice}</p>
      <p>Rent Price: {product.rentPrice}</p>
      
      <button
        className={`heart-button ${like ? 'liked' : ''}`}
        aria-label="Like"
        onClick={handleLike}
      >
        <span className="heart"></span>
      </button>


      {/* <button class="heart-button" aria-label="Like">
        <span class="heart"></span>
    </button> */}
    </div>
  );
};

export default Item;