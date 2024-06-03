// // import { useState, useEffect } from 'react';
// // import Item from '../Components/Item'; // Adjust the import path as needed

// // const Requests = () => {
// //   const [requests, setRequests] = useState([]);

// //   useEffect(() => {
// //     const fetchRequests = async () => {
// //       const pendingRequests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
// //       try {
// //         const responses = await Promise.all(
// //           pendingRequests.map(id => fetch(`http://localhost:5050/post/${id}`))
// //         );
// //         const posts = await Promise.all(responses.map(res => res.json()));

// //         const requestsWithBuyers = await Promise.all(posts.map(async (post) => {
// //           const buyerResponse = await fetch(`http://localhost:5050/user/${post.buyerId}`);
// //           const buyer = await buyerResponse.json();
// //           return { ...post, buyerUsername: buyer.username };
// //         }));

// //         setRequests(requestsWithBuyers);
// //       } catch (error) {
// //         console.error('Failed to fetch pending requests:', error);
// //       }
// //     };

// //     fetchRequests();
// //   }, []);

// //   return (
// //     <div>
// //       <h2>Requests</h2>
// //       {requests.length === 0 ? (
// //         <p>No pending requests.</p>
// //       ) : (
// //         <div>
// //           {requests.map((request) => (
// //             <div key={request._id}>
// //               <Item product={request} sold={request.sold} />
// //               <p>Requested by: {request.buyerUsername}</p>
// //               <button>Accept</button>
// //               <button>Decline</button>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Requests;

// import { useState, useEffect } from 'react';
// import Item from '../Components/Item'; // Adjust the import path as needed

// const Requests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const pendingRequests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
//       try {
//         const responses = await Promise.all(
//           pendingRequests.map(id => fetch(`http://localhost:5050/post/${id}`))
//         );
//         const posts = await Promise.all(responses.map(res => res.json()));

//         const requestsWithBuyers = await Promise.all(posts.map(async (post) => {
//           const buyerResponse = await fetch(`http://localhost:5050/user/${post.buyerId}`);
//           if (!buyerResponse.ok) {
//             throw new Error('Failed to fetch buyer info');
//           }
//           const buyer = await buyerResponse.json();
//           return { ...post, buyerUsername: buyer.username };
//         }));

//         setRequests(requestsWithBuyers);
//       } catch (error) {
//         console.error('Failed to fetch pending requests:', error);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const handleAccept = async (postId) => {
//     try {
//       const response = await fetch(`http://localhost:5050/post/${postId}/accept`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const { notification, buyerUsername, buyerId } = await response.json();
        
//         // Update the buyer's local storage with the notification
//         let buyerNotifications = JSON.parse(localStorage.getItem(`${buyerUsername}_notifications`)) || [];
//         buyerNotifications.push(notification);
//         localStorage.setItem(`${buyerUsername}_notifications`, JSON.stringify(buyerNotifications));

//         // Update the UI to remove the accepted request
//         setRequests(requests.filter(request => request._id !== postId));
//       } else {
//         console.error('Failed to accept the request');
//       }
//     } catch (error) {
//       console.error('Error accepting the request:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Requests</h2>
//       {requests.length === 0 ? (
//         <p>No pending requests.</p>
//       ) : (
//         <div>
//           {requests.map((request) => (
//             <div key={request._id}>
//               <Item product={request} sold={request.sold} />
//               <p>Requested by: {request.buyerUsername}</p>
//               <button onClick={() => handleAccept(request._id)}>Accept</button>
//               <button>Decline</button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Requests;

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
          if (!buyerResponse.ok) {
            throw new Error('Failed to fetch buyer info');
          }
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

  const handleAccept = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5050/post/${postId}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);

        // Update the buyer's local storage with the notification
        const buyerUsername = requests.find(request => request._id === postId).buyerUsername;
        let buyerNotifications = JSON.parse(localStorage.getItem(`${buyerUsername}_notifications`)) || [];
        buyerNotifications.push(data.message);
        localStorage.setItem(`${buyerUsername}_notifications`, JSON.stringify(buyerNotifications));

        // Update the UI to remove the accepted request
        setRequests(requests.filter(request => request._id !== postId));

        // Remove from localStorage pendingRequests
        const pendingRequests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
        const updatedPendingRequests = pendingRequests.filter(id => id !== postId);
        localStorage.setItem('pendingRequests', JSON.stringify(updatedPendingRequests));
      } else {
        console.error('Failed to accept the request');
      }
    } catch (error) {
      console.error('Error accepting the request:', error);
    }
  };

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
              <button onClick={() => handleAccept(request._id)}>Accept</button>
              <button>Decline</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
