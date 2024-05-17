import React from 'react';
import './Gallery.css'; // Assuming you have a CSS file for styling
import cat from '../assets/meow.jpeg';
import egg from '../assets/egg.jpg';
import eggback from '../assets/eggback.jpg';
import Item from './Item.jsx';
const Gallery = () => {
  // Sample filters and products
  const filters = ['Category', 'Price', 'Brand', 'Rating'];
  const products = [
    { id: 1, name: 'stupid man', image: cat, buyPrice: '$1000', rentPrice: '$9'},
    { id: 2, name: 'egg', image: egg, buyPrice: '$10', rentPrice: '$10'},
    { id: 3, name: 'egg (scrambled)', image: eggback, buyPrice: '$10', rentPrice: '$10'},
  ];

  return (
    <div className="product-list-container">
      <div className="filters-section">
        <h2>Filters</h2>
        <ul>
          {filters.map((filter, index) => (
            <li key={index}>{filter}</li>
          ))}
        </ul>
      </div>
      <div className="products-gallery">
        <h2>Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <Item product={product}/>
            //<Item id={product.id} name={product.name} buyPrice={product.buyPrice} rentPrice={product.rentPrice} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
