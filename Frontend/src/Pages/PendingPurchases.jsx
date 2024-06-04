import { useState, useEffect } from 'react';
import Item from '../Components/Item.jsx';

export default function PendingPurchases() {
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
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

    fetchPendingProducts();
  }, []);

  return (
    <div>
      <h2>Pending Purchases</h2>
      <p>Below are your pending purchases. Your purchase is not confirmed until the seller accepts and confirms your purchase.</p>
      <div className="products-gallery">
        <div className="products-grid">
          {pendingPosts.length === 0 ? (
            <p>No pending purchases.</p>
          ) : (
            pendingPosts.map((product) => (
              <Item key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}