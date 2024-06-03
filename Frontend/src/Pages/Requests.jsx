import { useState, useEffect } from 'react';
import Item from '../Components/Item'; // Adjust the import path as needed

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const pendingRequests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
      try {
        const responses = await Promise.all(
          pendingRequests.map(id => fetch(`http://localhost:5050/post/${id}`))
        );
        const posts = await Promise.all(responses.map(res => res.json()));

        const requestsWithBuyers = await Promise.all(posts.map(async (post) => {
          const buyerResponse = await fetch(`http://localhost:5050/user/${post.buyerId}`);
          const buyer = await buyerResponse.json();
          return { ...post, buyerUsername: buyer.username };
        }));

        setRequests(requestsWithBuyers);
      } catch (error) {
        console.error('Failed to fetch pending requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <h2>Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div>
          {requests.map((request) => (
            <div key={request._id}>
              <Item product={request} sold={request.sold} />
              <p>Requested by: {request.buyerUsername}</p>
              <button>Accept</button>
              <button>Decline</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
