import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ItemPage.css';

const ItemPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className='item-page'>
        <div className='item-display'>
            <div className='item-image'>
                <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
            </div>
            <div className='item-info'>
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                <p>Buy Price: {product.buyPrice}</p>
                <p>Rent Price: {product.rentPrice}</p>
            </div>
        </div>
        <div className='comment-section'>
            <p>MEOWMEOWMEOWMEOWMEOW</p>
        </div>
    </div>
  );
};

export default ItemPage;
