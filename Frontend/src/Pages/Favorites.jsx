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
        const username = localStorage.getItem('username');
        const response = await fetch(`http://localhost:5050/user/${username}/likedPost`);
    
        if (response.ok) {
            const data = await response.json();
            // Store likedPosts as a JSON string
            localStorage.setItem('likedPosts', JSON.stringify(data.user.likedPosts));
        } else {
            console.error("Error Fetching Usernames");
        }
    
        // Retrieve and parse likedPosts array from localStorage
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

  const fuse = new Fuse(products, {keys: ["name"]});

  const getProductsAsItems = () => {
    var ret = []
    if(searchQuery === "") {
      ret = products;
    } else {
      ret = fuse.search(searchQuery).map(obj => obj.item);
    }
    ret = ret.map((product) => (
      <Item key={product._id} product={product} />
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
           {getProductsAsItems()}
         </div>
    </div>
  </div>
  );
};

export default Favorites;