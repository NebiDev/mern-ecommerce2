import '../pageStyles/Cart.css';
import PageTitle from '../components/PageTitle';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';

function Cart() {
  const { cartItems } = useSelector((state) => state.cart);

  // Subtotal calculation
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = +(subtotal * 0.18).toFixed(2);
  const shipping = 0;
  const total = +(subtotal + tax + shipping).toFixed(2);

  return (
    <>
      <PageTitle title="Cart" />
      <div className="cart-page">
        <div className="cart-items">
          <div className="cart-items-heading">Your Cart</div>

          <div className="cart-table">
            <div className="cart-table-header">
              <div className="header-product">Product</div>
              <div className="header-quantity">Quantity</div>
              <div className="header-total item-total-heading">Item Total</div>
              <div className="header-action item-total-heading">Actions</div>
            </div>

            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <CartItem item={item} key={item.product} />
              ))
            )}
          </div>
        </div>

        {/* Price summary */}
        <div className="price-summary">
          <h3 className="price-summary-heading">Price Summary</h3>
          <div className="summary-item">
            <p className="summary-label">Subtotal:</p>
            <p className="summary-value">${subtotal.toFixed(2)}</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Tax (18%):</p>
            <p className="summary-value">${tax}</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Shipping:</p>
            <p className="summary-value">Free</p>
          </div>
          <div className="summary-total">
            <p className="total-label total-amount">Total:</p>
            <p className="total-value total-amount">${total}</p>
          </div>
          {cartItems.length > 0 && (
            <button className="checkout-btn">Proceed to Checkout</button>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
