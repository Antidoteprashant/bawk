import React from 'react';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }) => {
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart ({cartItems.length})</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <button className="start-shopping-btn" onClick={onClose}>Start Shopping</button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    {/* In a real app, use item.image */}
                                    <div className="cart-img-placeholder"></div>
                                </div>
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="cart-item-price">₹{item.price} x {item.quantity}</p>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveItem(item.id)}
                                    aria-label="Remove item"
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
