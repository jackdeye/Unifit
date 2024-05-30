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