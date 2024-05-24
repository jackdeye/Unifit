import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Item.css'; // Assuming you have a CSS file for styling

const Item = ({ product }) => {
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike(!like);
    console.log(`set favorite to ${!like}`);
  };

  return (
    <div className="product-item">
      {/* <Link to="/postpage">Posts */}
      <Link to={`/item/${product._id}`}>
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
      </Link>
    </div>
  );
};

export default Item;