import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/ItemPage.css';
import { Avatar, Button, TextField, Typography, Box, Paper, Grid } from '@mui/material';

const ItemPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const curUsername = localStorage.getItem('username');
 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5050/post/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.log(response);
          console.error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!product) return;

      try {
        const response = await fetch(`http://localhost:5050/post/${product._id}/availability`);
        if (response.ok) {
          const data = await response.json();
          setAvailability({
            start: new Date(data[0]),
            end: new Date(data[1])
          });
        } else {
          console.error('Failed to fetch availability');
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [product]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5050/post/${id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [id]);
  const getProfileInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const handleCommentSubmit = async () => {
    if (!newComment) return;
    const pfp = localStorage.getItem('profilePicture');
    const commentData = {
      profPicture: pfp,
      username: curUsername,
      comment: newComment,
    };

    try {
      const response = await fetch(`http://localhost:5050/post/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const createdComment = await response.json();
        alert(createdComment);
        setComments([...comments, createdComment]);
        setNewComment('');
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      const deleteResponse = await fetch(`http://localhost:5050/post/${id}`,{
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}` //must include token in Authorization header!
        }, 
      });
      navigate('/profile');
    } catch{
      alert("Failed to delete post");
      navigate('/profile');
    }
  };

  const handleRent = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
    if (!selectedDate) {
      alert('Please select a date to rent');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5050/post/${product._id}/rent`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Assuming you store token in localStorage
        },
        body: JSON.stringify({ date: selectedDate.toISOString().split('T')[0] })
      });

      if (response.ok) {
        alert('Item rented successfully!');
        setSelectedDate(null);
        // Fetch the current rentedPosts from localStorage
        const rentedPosts = JSON.parse(localStorage.getItem('rentedPosts')) || [];

        // Append the new product ID to the array
        rentedPosts.push(product._id);

        // Save the updated array back to localStorage
        localStorage.setItem('rentedPosts', JSON.stringify(rentedPosts));
      } else {
        alert('Item is not available. Please select another date.');
      }
    } catch (error) {
      console.error('Error renting the item:', error);
    }
  };

  function ButtonLink({ to, children, onClick }) {
    return (
      <Link to={to}> 
        <button onClick={onClick}>
          {children} </button>
      </Link>
    );
  }

  const isDateAvailable = (date) => {
    const { start, end } = availability;
    return start && end && date >= start && date <= end;
  };

  const isDateRented = (date) => {
    // Check if the date is in product.rented
    const dateString = date.toISOString().split('T')[0].slice(0, 10); // Get the first 10 characters (YYYY-MM-DD)
    return product.rented && product.rented.some(rentedDate => rentedDate.startsWith(dateString));
  };

  return (
    <Box className='item-page' component={Paper} p={3}>
        <Grid container spacing={3}>
        <Grid item xs={6}>
          <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
            <Typography variant="h3">{product.name}</Typography>
            <Typography variant="body1">{product.desc}</Typography>
            <Typography variant="body1">Quality: {product.quality}</Typography>
            <Typography variant="body1">Size: {product.size}</Typography>
            <Typography variant="body1">School: {product.school}</Typography>
            </Grid>
            <Grid item xs={6}>
            {curUsername === product.username && (
            <>
              <Button variant="contained" component={Link} to={`/edititem/${product._id}`} onClick={() => localStorage.setItem('EditPageButton', 'true')} sx={{ ml: 2 , mt:2}}>
                Edit Post
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 , mt:2}}>
                Delete Post
              </Button>
            </>
          )}
             {product.isForRent && (<Button variant="contained" onClick={handleRent} sx={{ ml: 2 , mt:2}} >Confirm Rental</Button>)}

            </Grid>
          </Grid>
          <Grid>
          {product.isForSale && <Typography variant="body1">Buy Price: {product.buyPrice}</Typography>}
          {product.isForRent && <Typography variant="body1">Rent Price: {product.rentPrice}</Typography>}
          {product.isForRent && (
            <>
              <DatePicker
                inline
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dayClassName={date => {
                  const dateString = date.toISOString().split('T')[0];
                  if (selectedDate && dateString === selectedDate.toISOString().split('T')[0]) 
                    return 'selected';
                  if (!isDateAvailable(date) || isDateRented(date)) 
                    return 'unavailable';
                  return 'available';
                }}
              />
            </>
          )}
          </Grid>


        </Grid>
      </Grid>
      <Box mt={3}>
        <Typography variant="h5">Reviews</Typography>
        <form onSubmit={handleCommentSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <Button type="submit" variant="contained" style={{ marginTop: '10px' }}>
            Post
          </Button>
        </form>
        <Box mt={3}>
          {comments.map((comment, index) => (
            <Box key={index} mb={2} display="flex" alignItems="center">
              <Avatar
                alt="Profile"
                src={`data:image/jpeg;base64,${comment.profPicture}`}
                sx={{ width: 30, height: 30, marginRight: 1 }}
              >
                {getProfileInitial(comment.username)}
              </Avatar>
              <Typography variant="body1">
                <strong>{comment.username}</strong>: {comment.comment}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
    // <div className='item-page'>
    //   <div className='item-display'>
    //     <div className='item-image'>
    //       <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
    //     </div>
    //     <div className='item-info'>
    //       <h3>{product.name}</h3>
    //       <p>{product.desc}</p>
    //       <p> Quality: {product.quality}</p>
    //       <p> Size: {product.size}</p>
    //       <p> School: {product.school}</p>
    //       {product.isForSale && <p>Buy Price: {product.buyPrice}</p>}
    //       {product.isForRent && <p>Rent Price: {product.rentPrice}</p>}
    //       {product.isForRent && (
    //         <>
    //           <DatePicker
    //             inline
    //             selected={selectedDate}
    //             onChange={date => setSelectedDate(date)}
    //             dayClassName={date => {
    //               const dateString = date.toISOString().split('T')[0];
    //               if (selectedDate && dateString === selectedDate.toISOString().split('T')[0]) 
    //                 return 'selected';
    //               if (!isDateAvailable(date) || isDateRented(date)) 
    //                 return 'unavailable';
    //               return 'available';
    //             }}
    //           />
    //           <button onClick={handleRent}>Confirm Rental</button>
    //         </>
    //       )}
    //       <div>
    //         {curUsername === product.username && (
    //           <>
    //             <ButtonLink to={`/edititem/${product._id}`} onClick={() => localStorage.setItem('EditPageButton', 'true')}> Edit Post </ButtonLink>
    //           <h5>
    //             <button onClick={handleDelete}>Delete Post</button>
    //           </h5>
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div className='comment-section'>
    //     <h3>Reviews</h3>
    //     <div className='comment-input'>
    //     <form onSubmit={handleCommentSubmit}>
    //       <textarea
    //         type='text'
    //         value={newComment}
    //         onChange={(e) => setNewComment(e.target.value)}
    //         placeholder='Add a comment'
    //       />
    //       <button type='submit'>Post</button>
    //       </form> 
    //     </div>
    //       <div className='comments-list'>
    //         {comments.map((comment, index) => (
    //           <div key={index} className='comment'>
    //             <p>

    //               <div className='userinfo'>
    //               <Avatar 
    //                 alt="Profile" 
    //                 src={`data:image/jpeg;base64,${comment.profPicture}`}
    //                 sx={{ width: 30, height: 30 }} // Adjust the size as needed
    //               >
    //                 {getProfileInitial(comment.username)}
    //               </Avatar>
    //             <strong>{comment.username}</strong>
    //             </div>
    //              {comment.comment}</p>
    //           </div>
    //         ))}
    //       </div>
    //   </div>

    // </div>
  );
};

export default ItemPage;
