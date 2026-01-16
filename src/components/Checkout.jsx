import React, { useState } from 'react';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cart, clearCart }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
    });

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        // IN A REAL APP: You would call your backend here to create an order
        // const data = await fetch('/api/payment/order', { ... }).then((t) => t.json());

        // FOR DEMO: We will just open the Razorpay modal with client-side options
        // IMPORTANT: Replace 'YOUR_RAZORPAY_KEY' with your actual test key id
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
            amount: totalPrice * 100, // Amount in paise
            currency: "INR",
            name: "The Mimicon",
            description: "Anime Merchandise Transaction",
            image: "https://via.placeholder.com/150", // You can replace this with your logo URL
            handler: function (response) {
                // Success Handler
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                clearCart();
                navigate('/');
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
            },
            notes: {
                address: formData.address,
            },
            theme: {
                color: "#00bcd4",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="checkout-title">Checkout</h1>
                <div className="checkout-container">
                    {/* Shipping Details Form */}
                    <div className="checkout-form-section">
                        <h2>Shipping Details</h2>
                        <form onSubmit={handlePayment} className="checkout-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Naruto Uzumaki"
                                />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="hokage@konoha.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="+91 99999 99999"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    placeholder="Hokage Office, Konoha"
                                ></textarea>
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="pay-btn">
                                Pay ₹{totalPrice} with Razorpay
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-section">
                        <h2>Order Summary</h2>
                        <div className="summary-card">
                            {cart.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                <div className="summary-items">
                                    {cart.map((item) => (
                                        <div key={item.id} className="summary-item">
                                            <div className="summary-item-info">
                                                <h4>{item.name}</h4>
                                                <p>Qty: {item.quantity}</p>
                                            </div>
                                            <div className="summary-item-price">
                                                <p>₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="summary-divider"></div>
                                    <div className="summary-total">
                                        <span>Total</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
