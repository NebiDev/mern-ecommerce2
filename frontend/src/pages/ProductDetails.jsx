import {useState, useEffect} from 'react'
import '../pageStyles/ProductDetails.css'
import PageTitle from '../components/PageTitle'

import { Rating } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { removeErrors, getProductDetails } from '../features/products/productSlice'
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify'
import Loader from '../components/Loader'
import PersonIcon from '@mui/icons-material/Person';



function ProductDetails() {
    const [userRating, setUserRating] = useState(0);

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);       
    }

    const { product, loading, error } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        if(id){
            dispatch(getProductDetails(id));
        }
        return () => {
            dispatch(removeErrors());
        }
    }, [dispatch, id]);

        useEffect(() => {
            if (error) {
                toast.error(error)
                dispatch(removeErrors())
            }
        }
        , [dispatch, error])

        
        if (loading || !product) return <Loader />;




  return (
    <>
    <PageTitle title={`${product.name}-details`} />
    <div className="product-details-container">
        <div className="product-detail-container">
            <div className="product-image-container">
                <img src={product.image[0].url.replace('./', '/')} alt="product title"
                className="product-detail-image" 
                />
            </div>
            <div className="product-info">
                <h2>{product.name} </h2>
                <p className="product-description">{product.description} </p>
                <p className="product-price">Price:{product.price} </p>
                <div className="product-rating">
                    <Rating 
                        value={product.ratings} 
                        readOnly
                        disabled={true}
                        />
                    <span className="productCardSpan">
                        ({product.numOfReviews} {product.numOfReviews===1? 'review' : 'reviews'})
                    </span>
                    
                </div>
                <div className="stock-status">
                    <span className="in-stock">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                </div>
                {product.stock > 0 && (<>
                <div className="quantity-controls">
                    <span className="quantity-label">Quantity: </span>
                    <button className="quantity-button">-</button>
                    <input type="number" className="quantity-value" value={1} readOnly />
                    <button className="quantity-button">+</button>
                </div>
                <button className="add-to-cart-btn">Add to Cart</button>
                </>)}
               
                    
                    <form className="review-form">
                        <h3>Write a review</h3>
                        <Rating
                            value={0} 
                            onChange={handleRatingChange}
                            disabled={false}
                            precision={0.5}
                            size="small"                           
                        />
                        <textarea className="review-input" rows="4" placeholder="Write your review here..."></textarea>
                        <button type="submit" className="submit-review-btn">Submit Review</button>
                    </form>
              
            </div>
        </div>
        <div className="reviews-container">
            <h3>Customer reviews</h3>
            {product.reviews && product.reviews.length>0? (<div className="reviews-section">
             {product.reviews.map((review, index) =>(
                <div className="review-item"  key={index}>
                    <div className="review-header">
                        <Rating
                            value={review.rating} 
                            readOnly
                            disabled={true}
                            precision={0.5}
                            size="small"
                            />
                    </div>
                    <p className="review-comment">{review.comment} </p>
                    <p className="review-name"><PersonIcon className='icon'/> {review.name}</p>
                </div>
                ))}
            </div>) : (<p className='no-reviews'>No reviews yet. Be the first to review this product.</p>)}
        </div>
        
    </div>  
    </>
  )
}

export default ProductDetails
