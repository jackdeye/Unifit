import React from 'react';
import './Item.css'; // Import the CSS for styling
import './Gallery.jsx';
import cat from '../assets/meow.jpeg';
import egg from '../assets/egg.jpg';
import eggback from '../assets/eggback.jpg';

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
