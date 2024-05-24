import React from 'react';
import '../styles/Item.css'; // Assuming you have a CSS file for styling
import { Link } from 'react-router-dom';

const Item = ({ product }) => {
  return (
    <div className="product-item">
      {/* <Link to="/postpage">Posts */}
      <Link to={`/item/${product._id}`}>
      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Buy Price: {product.buyPrice}</p>
      <p>Rent Price: {product.rentPrice}</p>
      </Link>
    </div>
  );
};

export default Item;
