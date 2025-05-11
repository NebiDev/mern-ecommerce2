import {useState, useEffect} from 'react'
import '../pageStyles/ProductDetails.css'
import PageTitle from '../components/PageTitle'

import { Rating } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { removeErrors as removeProductErrors , getProductDetails } from '../features/products/productSlice'

import {removeErrors as removeCartErrors,
     removeMessages as removeCartMessages,
     resetSuccess as resetCartSuccess, 
     addItemsToCart } from '../features/cart/cartSlice'
import { useParams, useNavigate  } from 'react-router-dom';
import {toast} from 'react-toastify'
import Loader from '../components/Loader'
import PersonIcon from '@mui/icons-material/Person';
import GoBackButton from '../components/GoBackButton';





function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [review, setReview] = useState('');

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);       
    }

    const { product, loading, error } = useSelector((state) => state.product);
    const {loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        if(id){
            dispatch(getProductDetails(id));
        }
        return () => {
            dispatch(removeProductErrors ());
        }
    }, [dispatch, id]);

        useEffect(() => {
            if (error) {
                toast.error(error)
                dispatch(removeProductErrors ())
            }
            if (cartError) {
                toast.error(cartError)
                dispatch(removeCartErrors())
            }
            if (success && message) {
                toast.success(message)
                dispatch(removeCartErrors());
                dispatch(removeCartMessages())
                dispatch(resetCartSuccess())
            }
        }
        , [dispatch, error, cartError, success, message ]);

        useEffect(() => {
            console.log("Cart Items Updated:", cartItems);
          }, [cartItems]);
          


    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        } else {
            toast.error('Maximum stock limit reached');
        }
    };

    const decreseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            toast.error('Minimum quantity is 1');
        }
    };

    const addToCarthandler = () => {
        console.log("Adding to cart: ", id, quantity);
        dispatch(addItemsToCart({id, quantity}));
        
    }

        
        
        
        
        
        
        if (loading || !product) return <Loader />;

  return (
    <>
    <PageTitle title={`${product.name}-details`} />
    <div className="product-details-container">
        <GoBackButton fallback="/products" />
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
                    <button className="quantity-button" onClick={decreseQuantity} >-</button>
                    <input type="number" className="quantity-value" value={quantity} readOnly />
                    <button className="quantity-button" onClick={increaseQuantity} >+</button>
                </div>
                <button
                    onClick={addToCarthandler} 
                    className="add-to-cart-btn"
                    disabled={cartLoading ? true : false}
                    >
                    {cartLoading ? 'Adding...' : 'Add to cart'}                       
                </button>
                </>
            )}
                                 
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
