import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../componentStyles/Product.css'
import Rating from '../components/Rating'

function Product({product}) {
    const [rating, setRating] = useState(0);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(`New rating: ${newRating}`);
        
    }
    
    
  return (
    <Link to={`/product/${product._id}`} className='product_id'>
    <div className='product-card'>
        <img src={product.image[0].url} alt={product.name} className='product-image-card' />
        <div className="product-details">
            <h3 className="product-title">{product.name}</h3>
            <p className="home-price">${product.price}</p>
            <div className="rating_container">
                <Rating 
                    value={product.ratings} 
                    onRatingChange={handleRatingChange}
                    disabled={true}
                    readOnly={true}
                    size= "small"
                    
                    />
               
            </div>
            <span className="productCardSpan">
                ({product.numOfReviews} {product.numOfReviews===1? 'review' : 'reviews'})
            </span>
            <button className='add-to-cart'>View details</button>
        </div>
      
    </div>
    </Link>
  )
}

export default Product
