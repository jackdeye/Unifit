import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Item = ({ product }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:5050/post/${product._id}/availability`);
        if (response.ok) {
          const data = await response.json();
          setAvailability(data.map(date => new Date(date)));
        } else {
          console.error('Failed to fetch availability');
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [product._id]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const isDateUnavailable = (date) => {
    return availability.some(unavailableDate => unavailableDate.getTime() === date.getTime());
  };

  return (
    <div className="product-item">
      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Buy Price: {product.buyPrice}</p>
      <p>Rent Price: {product.rentPrice}</p>
      {/* <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        filterDate={date => !isDateUnavailable(date)}
      /> */}
    </div>
  );
};

export default Item;
