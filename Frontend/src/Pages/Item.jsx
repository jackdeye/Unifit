import React from 'react';

const Item = ({ product }) => {
  return (
    <div className="product-item">
      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Buy Price: {product.buyPrice}</p>
      <p>Rent Price: {product.rentPrice}</p>
    </div>
  );
};

export default Item;
