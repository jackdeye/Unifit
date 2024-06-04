import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";
import Item from '../Components/Item.jsx';
import "../styles/Gallery.css";
import {Avatar, Container, Box, Typography, Button, Tabs, Tab, Grid} from '@mui/material';

export default function Profile() {
  const [products, setProducts] = useState([]);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [rentedPosts, setRentedPosts] = useState([]);
  const [school] = useState(localStorage.getItem('school'));
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    // alert(localStorage.getItem("school"));
    const fetchProducts = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          alert(localStorage.getItem('school'));
          const response = await fetch(`http://localhost:5050/post/user/${username}`);
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            console.error("Error fetching user's products");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    const fetchPurchasedProducts = async () => {
      const purchasedProductIds = JSON.parse(localStorage.getItem('purchasedPosts')) || [];
      if (purchasedProductIds.length > 0) {
        try {
          const responses = await Promise.all(
            purchasedProductIds.map(id => fetch(`http://localhost:5050/post/${id}`))
          );
          const data = await Promise.all(responses.map(res => res.json()));
          setPurchasedPosts(data);
        } catch (error) {
          console.error("Error fetching purchased products:", error);
        }
      }
    };
    const fetchRentedProducts = async () => {
      const rentedProductIds = JSON.parse(localStorage.getItem('rentedPosts')) || [];
      console.log("rentedProductIds", rentedProductIds);
      if (rentedProductIds.length > 0) {
        try {
          const responses = await Promise.all(
            rentedProductIds.map(id => fetch(`http://localhost:5050/post/${id}`))
          );
          const data = await Promise.all(responses.map(res => res.json()));
          setRentedPosts(data);
        } catch (error) {
          console.error("Error fetching rented products:", error);
        }
      }
    };

    fetchProducts();
    fetchPurchasedProducts();
    fetchRentedProducts();
  }, []);

  const getProfileInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };
  const handleTabChange = (event, newTab) => {
    setTabIndex(newTab);
  };
  return (
    <Container>
      <Box display='flex' alignItems='center' flexDirection='column' mt={4}>
        <Avatar 
          alt="Profile" 
          src={`data:image/jpeg;base64,${localStorage.getItem("profilePicture")}`}
          sx={{ width: 100, height: 100 }}
        >
          {getProfileInitial(localStorage.getItem("profile"))}
        </Avatar>
        <Typography variant='h4' mt={2}>
          {localStorage.getItem("profile")}
        </Typography>
        <Typography variant='h5' >
          @{localStorage.getItem("username")}
        </Typography>
        {localStorage.getItem("bio")!=null && <Typography>
          {localStorage.getItem("bio")}
        </Typography>}
        {school && <Typography variant='h6'>
          {school}
        </Typography>}
      </Box>
       <Box mt={2} textAlign='center'>
        <Button variant='contained' component={Link} to="/EditProfile">
          Edit Profile
        </Button>
        <Button variant='contained' component={Link} to="/postpage" sx={{ml:2}}>
          Create Post
        </Button>
      </Box>
      <Box mt={2}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label='Your Shop'/>
          <Tab label='Purchases'/>
          <Tab label='Rentals'/>
        </Tabs>
        {tabIndex === 0 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              {products.length === 0 ? (
                <Typography>No items listed yet.</Typography>
              ) : (
                products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Item product={product} />
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              {purchasedPosts.length === 0 ? (
                <Typography>No items listed yet.</Typography>
              ) : (
                purchasedPosts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                     <Item key={product._id} product={product} />
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
        {tabIndex === 2 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              {rentedPosts.length === 0 ? (
                <Typography>No items listed yet.</Typography>
              ) : (
                rentedPosts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                     <Item key={product._id} product={product} />
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}
