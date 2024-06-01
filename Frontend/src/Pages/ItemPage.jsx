import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/ItemPage.css';

const ItemPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [availability, setAvailability] = useState([]);
  const navigate = useNavigate();

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


  const isDateAvailable = (date) => {
    const { start, end } = availability;
    return start && end && date >= start && date <= end;
  };

  return (
    <div className='item-page'>
      <div className='item-display'>
        <div className='item-image'>
          <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
        </div>
        <div className='item-info'>
          <h3>{product.name}</h3>
          <p>{product.desc}</p>
          {product.isForSale && <p>Buy Price: {product.buyPrice}</p>}
          {product.isForRent && <p>Rent Price: {product.rentPrice}</p>}
          <Link to={`/edititem/${product._id}`}> EDIT POST </Link>
          <h5><button onClick={handleDelete}>Delete Post</button></h5>
        </div>
      </div>
      <div className='comment-section'>
        <p>MEOWMEOWMEOWMEOWMEOW</p>
      </div>
      <DatePicker
        inline
        readOnly
        dayClassName={date => isDateAvailable(date) ? 'available' : undefined}
      />
    </div>
  );
};

export default ItemPage;
