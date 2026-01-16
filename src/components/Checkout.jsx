import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Login from './Login';
import Register from './Register'; // Added Register import

const Checkout = ({ cart, clearCart }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register' - New state for auth mode
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
    });

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            handleAuthSuccess(session.user); // Changed to handleAuthSuccess
        }
    };

    const handleAuthSuccess = async (user) => { // Renamed from handleLoginSuccess
        setUser(user);
        setAuthMode('login'); // Reset auth mode to login after successful auth
        // Pre-fill email from auth
        setFormData(prev => ({ ...prev, email: user.email }));

        // Try to fetch profile for more details
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
            setFormData(prev => ({
                ...prev,
                name: data.full_name || prev.name,
                phone: data.phone || prev.phone,
                address: data.address || prev.address,
                city: data.city || prev.city,
                zip: data.zip || prev.zip
            }));
        }
    };

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
            handler: async function (response) {
                // Success Handler
                try {
                    // 1. Create Order
                    const { data: orderData, error: orderError } = await supabase
                        .from('orders')
                        .insert([{
                            user_id: user ? user.id : null,
                            total_amount: totalPrice,
                            status: 'paid',
                            payment_id: response.razorpay_payment_id,
                            shipping_description: `${formData.address}, ${formData.city}, ${formData.zip}`,
                            contact_email: formData.email,
                            contact_phone: formData.phone
                        }])
                        .select()
                        .single();

                    if (orderError) throw orderError;

                    // 2. Create Order Items
                    const orderItems = cart.map(item => ({
                        order_id: orderData.id,
                        product_id: item.id,
                        quantity: item.quantity,
                        price_at_purchase: item.price
                    }));

                    const { error: itemsError } = await supabase
                        .from('order_items')
                        .insert(orderItems);

                    if (itemsError) throw itemsError;

                    // 3. Save User Data (Profile Update)
                    if (user) {
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .update({
                                address: formData.address,
                                city: formData.city,
                                zip: formData.zip,
                                phone: formData.phone,
                                full_name: formData.name
                            })
                            .eq('id', user.id);

                        if (profileError) console.error("Failed to update user profile", profileError);
                    }

                    alert(`Payment Successful! Order ID: ${orderData.id}`);
                    clearCart();
                    navigate('/');

                } catch (error) {
                    console.error('Error saving order:', error);
                    alert('Payment successful, but failed to save order. Please contact support.');
                }
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

                    {!user ? (
                        <div className="checkout-auth-section" style={{ flex: 1, maxWidth: '600px', margin: '0 auto' }}>
                            {authMode === 'login' ? (
                                <>
                                    <Login onLoginSuccess={handleAuthSuccess} />
                                    <div style={{ textAlign: 'center', marginTop: '1rem', color: '#fff' }}>
                                        New to Bawk? <button onClick={() => setAuthMode('register')} style={{ background: 'none', border: 'none', color: '#00e676', cursor: 'pointer', textDecoration: 'underline' }}>Create an account</button> to continue.
                                    </div>
                                </>
                            ) : (
                                <Register onRegisterSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthMode('login')} />
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Shipping Details Form */}
                            <div className="checkout-form-section">
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1b5e20', borderRadius: '8px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Welcome, <strong>{user.email}</strong></span>
                                </div>

                                <h2>Confirm Shipping Details</h2>
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
                                                readOnly // Email is from auth
                                                style={{ opacity: 0.7 }}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
