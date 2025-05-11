import {useState, useEffect} from "react";
import { toast } from 'react-toastify'
import {useDispatch, useSelector} from 'react-redux'
import { removeErrors, addItemsToCart, removeItemFromCart } from "../features/cart/cartSlice";

function CartItem({item}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const {loading, error, success, message, cartItems} = useSelector((state) => state.cart)



  const dispatch = useDispatch();




 const decreaseQuantity = () => {
    if(quantity <=1) {
      toast.error("Minimum quantity is 1");
      dispatch(removeErrors());
      return;
    }
    setQuantity(quantity => quantity - 1);
  }
    const increaseQuantity = () => {
      if(item.stock <= quantity) {
        toast.error("Maximum avalable quantity is " + item.stock + " for this item"); ;
        dispatch(removeErrors());
        return;
      }
      setQuantity(quantity => quantity + 1);
    }

  const handleUpdate = () => {
    if(loading) return;
    if(quantity !== item.quantity) {   
    dispatch(addItemsToCart({id:item.product, quantity}))
  }
}

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
    if (success && message) {
      toast.success(message);
      dispatch(removeErrors());
      dispatch(resetSuccess());
    }
  }, [dispatch, error, success, message]);

  const handleRemove = () => {
    if (loading) return;
    dispatch(removeItemFromCart(item.product));
    toast.success("Item removed from cart successfully!");
    dispatch(removeErrors());
  }





  return (
    <>
      <div className="cart-item">
        <div className="item-info">
          <img src={item.image} alt={item.name} className="item-image" />
          <div className="item-details">
            <h3 className="item-name">{item.name} </h3>
            <p className="item-price">
              <strong>{item.price.toFixed(2) }</strong>
            </p>
            <p className="item-quantity">
              <strong>{quantity} </strong>
            </p>
          </div>
        </div>
        <div className="quantity-controls">
          <button className="quantity-button decrease-btn" onClick={decreaseQuantity} disabled={loading} >-</button>
          <input type="number" className="quantity-input" value={quantity} readOnly />
          <button className="quantity-button increase-btn" onClick={increaseQuantity} disabled={loading} >+</button>
        </div>
        <div className="item-total">
          <span className="item-total-price">{(item.price*item.quantity).toFixed(2)} </span>
        </div>
        <div className="item-actions">
          {/* <button className="update-item-btn" onClick={handleUpdate} disabled={loading || quantity === item.quantity} > {loading? 'Updating' : 'Update'} </button> */}
          <button className="remove-item-btn" disabled={loading} onClick={handleRemove} > Remove </button>
        </div>
      </div>
    </>
  );
}

export default CartItem;
