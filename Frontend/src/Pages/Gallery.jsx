import React, { useEffect, useState } from 'react';
//import './Gallery.css'; // Assuming you have a CSS file for styling
import Item from './Item.jsx';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5050/post');
        if (response.ok) {
          const data = await response.json();
          const productsWithImages = data.filter(product => product.image);
          setProducts(productsWithImages);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <div className="filters-section">
        <h2>Filters</h2>
        <ul>
          {/* Add your filters here */}
          <li>Buy</li>
          <li>Rent</li>
          <li>Price</li>
          <li>Rent</li>
        </ul>
      </div>
      <div className="products-gallery">
        <h2>Products</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Item key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
