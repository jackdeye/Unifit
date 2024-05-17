import React from 'react';
import './Gallery.jsx';
import '../styles/Item.css'
import cat from "/Users/alyssaleung/CS35L/Unifit/Frontend/Subject.jpg"


const Item = ({ product }) => {
  return (
    <div className="product-item">
      <img src={cat} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Buy Price: {product.buyPrice}</p>
      <p>Rent Price: {product.rentPrice}</p>
    </div>
  );
};

export default Item;
