import React from 'react';
<<<<<<< HEAD
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
=======

const Item = ({ product }) => {
  return (
    <div className="product-item">
      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Buy Price: {product.buyPrice}</p>
      <p>Rent Price: {product.rentPrice}</p>
>>>>>>> origin/main
    </div>
  );
};

<<<<<<< HEAD
export default Item;
=======
export default Item;
>>>>>>> origin/main
