import React, { useEffect, useState } from 'react';
import '../styles/Gallery.css'; 
import Item from './Item.jsx';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForSale, setShowForSale] = useState(true);
  const [showForRent, setShowForRent] = useState(true);

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

  const handleToggleForSale = () => {
    setShowForSale(prev => !prev);
  };

  const handleToggleForRent = () => {
    setShowForRent(prev => !prev);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSaleFilter = showForSale ? product.isForSale : true;
    const matchesRentFilter = showForRent ? product.isForRent : true;
    return matchesSearch && matchesSaleFilter && matchesRentFilter;
  });

  return (

    <div className="product-list-container">
      <div className="filters-section">
        <h2>Filters</h2>
        <ul>
          <li><input type="checkbox" checked={showForSale} onChange={handleToggleForSale} /> For Sale</li>
          <li><input type="checkbox" checked={showForRent} onChange={handleToggleForRent} /> For Rent</li>
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
