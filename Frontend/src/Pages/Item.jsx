import React from 'react';
import './Gallery.jsx';
import '../styles/Item.css'
import cat from "/Users/alyssaleung/CS35L/Unifit/Frontend/Subject.jpg"

const Item = ({product}) => {
  return (
    <div key={product.id} className="product-item">
        <h3>{product.name}</h3>
        <img src={product.image} />
        <p>{"Buy: " + product.buyPrice}</p>
        <p>{"Rent: " + product.rentPrice}</p>
    </div>
  );
};

export default Item;