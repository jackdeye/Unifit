import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Profile.css";
import Item from '../Components/Item.jsx';
import "../styles/Gallery.css";
import {Avatar, Container, Box, Typography, Button, Badge, Tabs, Tab, Grid} from '@mui/material';

export default function Profile() {
  const [products, setProducts] = useState([]);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [school] = useState(localStorage.getItem('school'));
  const [rentedPosts, setRentedPosts] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // alert(localStorage.getItem("school"));
    const fetchProducts = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
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
      const purchasedPosts = localStorage.getItem('purchasedPosts');
      let purchasedProductIds = [];
      if (purchasedPosts) {
        try {
          purchasedProductIds = JSON.parse(purchasedPosts);
        } catch (error) {
          console.error("Error parsing purchasedPosts:", error);
        }
      }
    
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

    const fetchPendingProducts = async () => {
      const pendingPosts = localStorage.getItem('pendingPosts');
      let pendingProductIds = [];
      if (pendingPosts) {
        try {
          pendingProductIds = JSON.parse(pendingPosts);
        } catch (error) {
          console.error("Error parsing pendingPosts:", error);
        }
      }
    
      if (pendingProductIds.length > 0) {
        try {
          const responses = await Promise.all(
            pendingProductIds.map(id => fetch(`http://localhost:5050/post/${id}`))
          );
          const data = await Promise.all(responses.map(res => res.json()));
          setPendingPosts(data);
        } catch (error) {
          console.error("Error fetching pending products:", error);
        }
      }
    };

    const fetchNotifications = () => { //note: this doesn't work because notifications isnt' in local storage anymore - got cleared
      const username = localStorage.getItem('username');
      const buyerNotifications = JSON.parse(localStorage.getItem('${username}_notifications')) || [];
      setNotifications(buyerNotifications);
    };

    fetchProducts();
    fetchPurchasedProducts();
    fetchRentedProducts();
    fetchPendingProducts();
    fetchNotifications();
  }, []);

  const getProfileInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };
  const handlePendingPurchasesClick = () => {
    navigate('/pending-purchases');
  };

  const handleTabChange = (event, newTab) => {
    setTabIndex(newTab);
  };
  return (
    <Container>
      <Box display='flex' alignItems='center' flexDirection='column' mt={4}>
        <div className="avatar-container">
          <Badge
            color="error"
            variant="dot"
            invisible={notifications.length === 0}
          >
            <Avatar
              alt="Profile"
              src={`data:image/jpeg;base64,${localStorage.getItem("profilePicture")}`}
              sx={{ width: 100, height: 100 }}
            >
              {getProfileInitial(localStorage.getItem("profile"))}
            </Avatar>
          </Badge>
        </div>
        <Typography variant='h3' mt={2}>
          {localStorage.getItem("profile")}
        </Typography>
        <Typography variant='h5'>
          @{localStorage.getItem("username")}
        </Typography>
        {localStorage.getItem("bio") !== "null" && (
          <Typography>
            {localStorage.getItem("bio")}
          </Typography>
        )}
        {school !== "undefined" && (
          <Typography variant='h6'>
            {school}
          </Typography>
        )}
        {notifications.length > 0 && (
          <div className="notifications">
            {notifications.map((notification, index) => (
              <p key={index}>{notification}</p>
            ))}
          </div>
        )}
      </Box>
      <Box mt={2} textAlign='center'>
        <Button variant='contained' component={Link} to="/EditProfile">
          Edit Profile
        </Button>
        <Button variant='contained' component={Link} to="/postpage" sx={{ ml: 2 }}>
          Create Post
        </Button>
        {pendingPosts.length > 0 && (
          <Button variant="contained" sx={{ ml: 2 }} onClick={handlePendingPurchasesClick}>
            Pending Purchases: {pendingPosts.length}
          </Button>
        )}
      </Box>
      <Box mt={2}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label='Your Shop' />
          <Tab label='Purchases' />
          <Tab label='Rentals' />
        </Tabs>
        {tabIndex === 0 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              {products.length === 0 ? (
                <Typography>No items listed yet.</Typography>
              ) : (
                products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Item product={product} sold={product.sold} />
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
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Item product={product} sold={product.sold}/>
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
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Item product={product} sold={product.sold}/>
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
