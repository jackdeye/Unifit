import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Item.css'; 
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Button,
} from '@mui/material';

const Item = ({ product, sold, showBuyRentButtons }) => {
  const [like, setLike] = useState(false);
  const navigate = useNavigate();

  const useEffect = async () => {
    try {
      const response = await fetch(`http://localhost:5050/post/${product._id}/currLiked`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token in localStorage
        }
      });

      if (response.ok) {
        const result = await response.json();
        const isLiked = result.isLiked;

        if (isLiked){
          setLike(true);
          // alert("initialized to true");
        } else {
          setLike(false);
          // alert("initialized to false");
        }
      } else {
        console.log("failed to check if liked");
      }
    } catch (error) {
      console.error("Failed in initialize like");
      alert("did not initialize");
    }
  }
  useEffect();

  const handleLike = async () => {
    setLike(!like); 
    try {

      console.log(`set favorite to ${!like}`);
      const response = await fetch(`http://localhost:5050/post/${product._id}/likepost`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token in localStorage
        }
      });
      if (response.ok) {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];

        const result = await response.json();
        const isLiked = result.isLiked;

        if (isLiked) {
          //liked
          likedPosts.push(product._id); //PULL PRODUCT ID FROM LOCAL STORAGE WHEN UNLIKED >:(((((((((((((())))))))))))))
  
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
          console.log("liked post"); 

          console.log(localStorage.getItem('likedPosts'));
        } else {
          //unliked

          const index = likedPosts.indexOf(product._id);
          likedPosts.splice(index, 1);

          localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
          console.log("unliked post");
          console.log(localStorage.getItem('likedPosts'));
        }

      } else {
        alert("Failed to like post");
      }

  } catch(error) {
      console.error("Error on liking post");
      alert("error on liking post");
  }
  };

  const handleBuyRequest = async () => {
    try {
      const response = await fetch(`http://localhost:5050/post/${product._id}/request`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        alert('Item requested successfully!');
        
        // Fetch the current pendingPosts from localStorage
        const pendingPosts = JSON.parse(localStorage.getItem('pendingPosts')) || [];
  
        // Append the new product ID to the array
        pendingPosts.push(product._id);
  
        // Save the updated array back to localStorage
        localStorage.setItem('pendingPosts', JSON.stringify(pendingPosts));
        
        localStorage.setItem('requested', true);
  
        // handle post-purchase logic, eg, updating UI
      } else {
        console.error('Failed to request the item');
      }
    } catch (error) {
      console.error('Error requesting the item:', error);
    }
  };
  return(
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={() => {
        navigate(`/item/${product._id}`);
      }}>
        <CardMedia
          sx={{ height: 200 }}
          image={`data:image/jpeg;base64,${product.image}`}
        >
          <button
              className={`heart-button ${like ? 'liked' : ''}`}
              aria-label="Like"
              onClick={handleLike}
            >
              <span className="heart"></span>
          </button>
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.isForSale && <p>Buy: ${product.buyPrice}</p>}
            {product.isForRent && <p>Rent: ${product.rentPrice}</p>}
          </Typography>
          {product.isForSale && showBuyRentButtons && <Button sx={{marginRight:"10px"}} variant="contained" onClick={handleBuyRequest}>Buy</Button>}
          {product.isForRent && showBuyRentButtons && (
            <Button variant="contained" onClick={()=>navigate(`/item/${product._id}`)}>
              Rent
            </Button>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Item;
