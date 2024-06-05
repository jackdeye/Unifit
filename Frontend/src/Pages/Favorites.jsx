import React, { useEffect, useState } from 'react';
import '../styles/Gallery.css'; 
import Fuse from 'fuse.js';
import Item from '../Components/Item.jsx';
import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const Favorites = () => {
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
        const posts = JSON.parse(localStorage.getItem('likedPosts')) || [];

        // Function to fetch post details by ID
        const fetchPostById = async (id) => {
          const response = await fetch(`http://localhost:5050/post/${id}`);
          if (response.ok) {
            return response.json();
          } else {
            console.error('Failed to fetch post:', id);
            return null;
          }
        };

        // Fetch all posts in parallel
        const postsData = await Promise.all(posts.map(fetchPostById));
        // Filter out any null responses (in case of fetch failures)
        setProducts(postsData.filter(post => post !== null));

      } catch (error) {
        console.error('Error fetching liked posts:', error);
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
      <Item key={product._id} product={product} showBuyRentButtons='true'/>
    ));
    if(ret.length === 0) {
      ret = <div>No Products Found</div>;
    }
    return ret;
  }

  return (
    <div className="product-list-container">
      <div className="products-favorite">
        <h2>Products</h2>
        <FormControl size="medium" fullWidth>
          <InputLabel htmlFor="outlined-adornment">Search</InputLabel>
          <OutlinedInput
            id="outlined-adornment"
            startAdornment={<InputAdornment position="start"><Search/></InputAdornment>}
            name="search"
            value={searchQuery}
            label="search-bar"
            onChange={handleSearchChange}
          />
        </FormControl>
        <div className="products-grid">
          {getFilteredAsItems()}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
