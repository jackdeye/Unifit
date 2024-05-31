import React, { useEffect, useState } from 'react';
import '../styles/Gallery.css'; 
import Item from '../Components/Item.jsx';
import Fuse from 'fuse.js';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForSale, setShowForSale] = useState(true);
  const [showForRent, setShowForRent] = useState(true);
  const [priceOrder, setPriceOrder] = useState('desc'); // Order of price sorting
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

  const handlePriceOrderChange = (event) => {
    setPriceOrder(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const filterProducts = (p) => p.filter(product => {
    const matchesSaleFilter = showForSale ? product.isForSale : true;
    const matchesRentFilter = showForRent ? product.isForRent : true;
    const buyPrice = product.isForSale ? product.buyPrice : Infinity;
    const rentPrice = product.isForRent ? product.rentPrice : Infinity;
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPriceRange = (buyPrice >= min && buyPrice <= max) || (rentPrice >= min && rentPrice <= max);
    return matchesSaleFilter && matchesRentFilter && matchesPriceRange;
  });

  const fuse = new Fuse(products, {keys: ["name"]});

  const getFilteredAsItems = () => {
    var ret = []
    if(searchQuery === "") {
      ret = products;
    } else {
      ret = fuse.search(searchQuery).map(obj => obj.item);
    }
    ret = filterProducts(ret).map((product) => (
      <Item key={product._id} product={product} />
    ));
    if(ret.length === 0) {
      ret = <div>No Products Found</div>;
    }
    return ret;
  }

  return (
    <div className="product-list-container">
      <div className="filters-section">
        <h2>Filters</h2>
        <ul>
          <li><input type="checkbox" checked={showForSale} onChange={handleToggleForSale} /> For Sale</li>
          <li><input type="checkbox" checked={showForRent} onChange={handleToggleForRent} /> For Rent</li>
        </ul>
        <div className="price-filter">
          <div className="price-input">
          <label>
            Min Price: 
            <input type="number" value={minPrice} onChange={handleMinPriceChange} placeholder="Min Price" />
          </label>
          </div>
          <div className="price-input">
            <label>
              Max Price: 
              <input type="number" value={maxPrice} onChange={handleMaxPriceChange} placeholder="Max Price" />
            </label>

          </div>
        </div>
        <div>
          <label>
            Sort By Price:
            <select value={priceOrder} onChange={handlePriceOrderChange}>
              <option value="asc">High to Low</option>
              <option value="desc">Low to High</option>
            </select>
          </label>
        </div>
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
          {getFilteredAsItems()}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
