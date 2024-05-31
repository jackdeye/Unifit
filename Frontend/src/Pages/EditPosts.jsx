import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/ItemPage.css';

const EditPosts = () => {
    const { id } = useParams();
    const [product, setProduct] = useState();
    const [availability, setAvailability] = useState([]);
  
    const navigate = useNavigate();``
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5050/post/${id}`);
          
          if (response.ok) {
            const data = await response.json();
            setProduct(data);
          } else {
            console.error('Failed to fetch product');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
  
      fetchProduct();
    }, [id]);
    
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        image: "",
        isForSale: false,
        isForRent: false,
        buyPrice: 0,
        rentPrice: 0,
        availability: true,
      });
  
    useEffect(() => {
        if (!product) return;
      const fetchAvailability = async () => {
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
      setFormData({
        name: product.name,
        desc: product.desc,
        image: product.image,
        isForSale: product.isForSale,
        isForRent: product.isForRent,
        buyPrice: product.buyPrice,
        rentPrice: product.rentPrice,
        availability: availability,
      });
    }, [product]);
  
    if (!product) {
      return <div>Loading...</div>;
    }
 
    
      const handleChange = (event) => {
        const { name, value, files, type, checked } = event.target;
        if (type === 'file') {
          setFormData(prev => ({
            ...prev,
            [name]: files[0], // Store only the first file
          }));
        } else if (type === 'checkbox') {
          setFormData(prev => ({
            ...prev,
            [name]: checked,
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [name]: value,
          }));
        }
      };
    
      const handleDateChange = (dates) => {
        const [start, end] = dates;
        setFormData(prev => ({
          ...prev,
          availability: [start, end]
        }));
      };
    
      const handleSubmit = async (event) => {
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
          if(deleteResponse.ok){
            alert("Saving!")
          }

          const username = localStorage.getItem('username');
          console.log("username: ", username);
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('desc', formData.desc);
          formDataToSend.append('image', formData.image);
          formDataToSend.append('isForSale', formData.isForSale);
          formDataToSend.append('isForRent', formData.isForRent);
          formDataToSend.append('buyPrice', formData.buyPrice);
          formDataToSend.append('rentPrice', formData.rentPrice);
          formDataToSend.append('availability', JSON.stringify(formData.availability));
          formDataToSend.append('username', username);
    
          const response = await fetch('http://localhost:5050/post/upload', {
            method: 'POST',
            credentials: 'include',
            body: formDataToSend,
            headers: {
              'Authorization': `Bearer ${token}` //must include token in Authorization header!
            },
          });
    
          if (response.ok) {
            alert('Post saved successfully!');
            setFormData({ name: ' ',
            desc: ' ',
            image: null,
            isForSale: false,
            isForRent: false,
            buyPrice: '',
            rentPrice: '',
            availability: []}); // reset form
          } else {
            const errorText = await response.text();
            console.error('Failed to save post:', errorText);
            throw new Error('Failed to save post.');
          }
          navigate(`/item/${product._id}`);
        } catch (error) {
          console.error('Error submitting post:', error);
          alert('Failed to save post.');
        }
      };
    
      return (
        <div className='container'>
          <h1 className='header'>Create a New Post</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Title:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
            </div>
            <div>
              <label>
                Description:
                <textarea name="desc" value={formData.desc} onChange={handleChange} required />
              </label>
            </div>
            <div>
              <label>
                Image:
                <input type="file" name="image" accept="image/*" onChange={handleChange} required />
              </label>
            </div>
            <div>
              <label>
                For Sale:
                <input type="checkbox" name="isForSale" checked={formData.isForSale} onChange={handleChange} />
              </label>
            </div>
            <div>
              <label>
                For Rent:
                <input type="checkbox" name="isForRent" checked={formData.isForRent} onChange={handleChange} />
              </label>
            </div>
            {formData.isForSale && (
              <div>
                <label>
                  Buy Price:
                  <input type="number" name="buyPrice" value={formData.buyPrice} onChange={handleChange} required={formData.isForSale} />
                </label>
              </div>
            )}
            {formData.isForRent && (
              <div>
                <label>
                  Rent Price:
                  <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} required={formData.isForRent} />
                </label>
              </div>
            )}
            <div>
              <label>
                Availability:
                <DatePicker
                  selected={formData.availability[0]}
                  onChange={handleDateChange}
                  startDate={formData.availability[0]}
                  endDate={formData.availability[1]}
                  selectsRange
                  inline
                />
              </label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      );
};

export default EditPosts;