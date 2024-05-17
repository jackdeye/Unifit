import { Link } from 'react-router-dom';
import "../styles/Profile.css"
<<<<<<< HEAD
import cat from "/Users/alyssaleung/CS35L/Unifit/Frontend/Subject.jpg"
import Item from './Item.jsx'
import "../styles/Gallery.css"
=======
import cat from "../../Subject.jpg"

>>>>>>> origin/main

export default function Profile() {

  const filters = ['Category', 'Price', 'Brand', 'Rating'];
  const products = [
    { id: 1, name: 'stupid man', image: cat, buyPrice: '$1000', rentPrice: '$9'},
    { id: 2, name: 'egg', image: cat, buyPrice: '$10', rentPrice: '$10'},
    { id: 3, name: 'egg (scrambled)', image: cat, buyPrice: '$10', rentPrice: '$10'},
  ];


  return (
    <div>
      <div className='header'>
        <h1>
          <img src={cat} />
          My Profile</h1>
      </div>

      <div className='all'>
        <div className='info'>
          <div>School</div>
          <div><Link to="/EditProfile">EditProfile</Link></div>
          <div><Link to="/postpage">Posts</Link></div>
        </div>

        <div className="products-gallery">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map((product) => (
              <Item product={product}/>
              //<Item id={product.id} name={product.name} buyPrice={product.buyPrice} rentPrice={product.rentPrice} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}