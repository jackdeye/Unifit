import React, { useEffect, useState } from 'react';
import '../styles/Gallery.css'; 
import Item from '../Components/Item.jsx';
import Fuse from 'fuse.js';
import { Search } from '@mui/icons-material';
import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  FormControlLabel,
  InputLabel,
  Paper,
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
} from '@mui/material';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForSale, setShowForSale] = useState(false);
  const [showForRent, setShowForRent] = useState(false);
  const [priceOrder, setPriceOrder] = useState('desc'); // Order of price sorting
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showSchoolPosts, setShowSchoolPosts] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      const school = localStorage.getItem('school');
      const username = localStorage.getItem('username');
      let url = 'http://localhost:5050/post';
      if (showSchoolPosts && school) {
        url = `http://localhost:5050/post/school/${school}`;
      }
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          let filteredProducts = data.filter(
            product => product.image 
            && !product.sold 
            && !product.pending 
            && product.username !== localStorage.getItem('username'));
          if (showSchoolPosts && school) {
            filteredProducts = filteredProducts.filter(product => product.school === school);
          }
          setProducts(filteredProducts);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [showSchoolPosts]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleToggleForSale = () => {
    setShowForSale(prev => !prev);
  };

  const handleToggleForRent = () => {
    setShowForRent(prev => !prev);
  };
  const handleToggleSchool = () => {
    setShowSchoolPosts(prev => !prev);
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
    let matchesSaleFilter = true;
    let matchesRentFilter = true;

    if (showForSale) {
        matchesSaleFilter = product.isForSale;
    }

    if (showForRent) {
        matchesRentFilter = product.isForRent;
    }

    if ((showForRent == showForSale)){
      matchesSaleFilter = true;
      matchesRentFilter = true;
    }

    const buyPrice = product.isForSale ? product.buyPrice : Infinity;
    const rentPrice = product.isForRent ? product.rentPrice : Infinity;
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPriceRange = (buyPrice >= min && buyPrice <= max) || (rentPrice >= min && rentPrice <= max);
    return matchesSaleFilter && matchesRentFilter && matchesPriceRange;
  });

  const fuse = new Fuse(products, {keys: ["name"]});

  const getFilteredAsItems = () => {
    let filteredProducts = products;

    if (searchQuery !== "") {
      filteredProducts = fuse.search(searchQuery).map(result => result.item);
    }

    filteredProducts = filterProducts(filteredProducts);

    if (priceOrder === 'asc') {
      filteredProducts.sort((a, b) => Math.min(a.buyPrice, a.rentPrice) - Math.min(b.buyPrice, b.rentPrice));
    } else {
      filteredProducts.sort((a, b) => Math.min(b.buyPrice, b.rentPrice) - Math.min(a.buyPrice, a.rentPrice));
    }

    if (filteredProducts.length === 0) {
      return <div>No Products Found</div>;
    }

    return filteredProducts.map(product => (
      <Item key={product._id} product={product} showBuyRentButtons='true'/>
    ));
  }

  return (
    //<div className="product-list-container">
    <Grid container>
      <Grid item xs={4} sx={{padding: "10px"}}>
        <Paper sx={{padding: "10px", borderRadius: "10px"}}>
          <Typography variant="h5">Filters</Typography>
          <FormGroup>
            <FormControlLabel 
              onChange={handleToggleForSale}
              control={<Checkbox defaultChecked={false} />}
              label="For Sale"
              value={showForSale}
              name="isForSale"
            />
            <FormControlLabel 
              onChange={handleToggleForRent}
              control={<Checkbox defaultChecked={false} />}
              label="For Rent"
              value={showForRent}
              name="isForRent"
            />
            <FormControlLabel 
              onChange={handleToggleSchool}
              control={<Checkbox/>}
              label="Posts from my School"
              value={showSchoolPosts}
              name="isForSchool"
            />
          </FormGroup>
          <FormControl sx={{marginTop:"15px"}}>
            <InputLabel htmlFor="outlined-adornment-min">Min Price</InputLabel>
            <OutlinedInput
              id="outlined-adornment-min"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              name="minPrice"
              value={minPrice}
              label="Min Price"
              onChange={handleMinPriceChange}
            />
          </FormControl>
          <FormControl sx={{marginTop:"15px"}}>
            <InputLabel htmlFor="outlined-adornment-max">Max Price</InputLabel>
            <OutlinedInput
              id="outlined-adornment-max"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              name="maxPrice"
              value={maxPrice}
              label="Max Price"
              onChange={handleMaxPriceChange}
            />
          </FormControl>
          <FormControl sx={{marginTop:"15px"}}>
            <InputLabel id="order-select-label">Sort By</InputLabel>
            <Select
              labelId="order-select-label"
              id="order-simple-select"
              value={priceOrder}
              label="sort by price"
              name="order"
              onChange={handlePriceOrderChange}
            >
              <MenuItem value="desc">High to Low</MenuItem>
              <MenuItem value="asc">Low to High</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={8} sx={{padding: "10px"}}>
        <Typography variant="h3" padding="10px">Products</Typography>
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
      </Grid>
    </Grid>
  );
};

export default Gallery;
