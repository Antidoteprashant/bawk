import React, { useState, useEffect } from 'react';
import './OrderTracking.css';
import { supabase } from '../lib/supabaseClient';

// Demo order data for testing (when no real order is found)
const DEMO_ORDER = {
    id: 'ORD-2024-001',
    tracking_number: 'BAWK87654321',
    status: 'shipped',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    total_amount: 2499,
    courier_partner: 'BlueDart Express',
    courier_tracking_link: 'https://www.bluedart.com/track',
    shipping_description: '123 Hokage Street, Konoha, Hidden Leaf Village, 110001',
    contact_phone: '+91 98765 43210',
    contact_email: 'naruto@konoha.com',
    customer_name: 'Naruto Uzumaki',
    items: [
        {
            id: 1,
            name: 'Luffy Gear 5 Action Figure',
            quantity: 1,
            price_at_purchase: 1599,
            size: 'A4',
            image_url: 'https://www.masioriginals.com/cdn/shop/files/1_bcf0f65d-47bb-476f-83c3-58a06dd02b7b.jpg?v=1753435528&width=1946'
        },
        {
            id: 2,
            name: 'Zoro Wano Arc Poster',
            quantity: 2,
            price_at_purchase: 450,
            size: 'A4',
            image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw7OPfKe8Xg_hU3sbxtSnDJisqqqHtngu_Xw&s'
        }
    ],
    tracking_history: [
        {
            status: 'Shipped',
            message: 'Package has been handed over to BlueDart Express',
            location: 'Mumbai Hub',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            status: 'Printed',
            message: 'Your poster has been printed and is ready for packaging',
            location: 'Bawk Printing Center',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            status: 'Processing',
            message: 'Order is being processed',
            location: 'Bawk Warehouse',
            timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            status: 'Order Placed',
            message: 'Your order has been confirmed',
            location: '',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
    ]
};

const STATUS_STEPS = [
    { key: 'placed', label: 'Order Placed', icon: '📝' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'printed', label: 'Printed', icon: '🖨️' },
    { key: 'shipped', label: 'Shipped', icon: '📦' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' }
];

const OrderTracking = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });

    // Notification preferences (UI only for now)
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        inApp: true
    });

    // Calculate countdown to estimated delivery
    useEffect(() => {
        if (!order?.estimated_delivery) return;

        const updateCountdown = () => {
            const now = new Date();
            const delivery = new Date(order.estimated_delivery);
            const diff = delivery - now;

            if (diff <= 0) {
                setCountdown({ days: 0, hours: 0, mins: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setCountdown({ days, hours, mins });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [order?.estimated_delivery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setOrder(null);
        setNotFound(false);

        // Check for demo order first
        if (searchQuery.toUpperCase() === 'ORD-2024-001' ||
            searchQuery.toUpperCase() === 'BAWK87654321' ||
            searchQuery.toLowerCase() === 'demo') {
            setTimeout(() => {
                setOrder(DEMO_ORDER);
                setLoading(false);
            }, 800);
            return;
        }

        try {
            // Try to find order by ID or tracking number
            const { data: orderData, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (name, image_url)
                    )
                `)
                .or(`id.eq.${searchQuery},tracking_number.eq.${searchQuery}`)
                .single();

            if (error || !orderData) {
                setNotFound(true);
            } else {
                // Transform order data
                const transformedOrder = {
                    ...orderData,
                    customer_name: orderData.customer_name || 'Customer',
                    courier_partner: orderData.courier_partner || 'Bawk Delivery',
                    estimated_delivery: orderData.estimated_delivery ||
                        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    items: orderData.order_items?.map(item => ({
                        ...item,
                        name: item.products?.name || 'Product',
                        image_url: item.products?.image_url || '',
                        size: 'A4'
                    })) || [],
                    tracking_history: orderData.tracking_history || [
                        {
                            status: 'Order Placed',
                            message: 'Your order has been confirmed',
                            timestamp: orderData.created_at
                        }
                    ]
                };
                setOrder(transformedOrder);
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setNotFound(true);
        }

        setLoading(false);
    };

    const getCurrentStepIndex = () => {
        if (!order) return -1;
        const statusMap = {
            'pending': 0,
            'paid': 0,
            'processing': 1,
            'printed': 2,
            'shipped': 3,
            'out_for_delivery': 4,
            'delivered': 5
        };
        return statusMap[order.status?.toLowerCase()] ?? 0;
    };

    const getProgressWidth = () => {
        const currentStep = getCurrentStepIndex();
        if (currentStep <= 0) return '0%';
        const percentage = ((currentStep) / (STATUS_STEPS.length - 1)) * 90;
        return `${percentage}%`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = () => {
        if (!order) return '';
        const status = order.status?.toLowerCase().replace(/\s+/g, '-');
        return `status-${status}`;
    };

    return (
        <div className="order-tracking-page">
            <div className="container">
                {/* Header */}
                <div className="tracking-header">
                    <h1>Track Your Order</h1>
                    <p>Enter your Order ID or Tracking Number to see real-time status</p>
                </div>

                {/* Search Section */}
                <div className="tracking-search-section">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Enter Order ID or Tracking Number (try 'demo')"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="search-btn">
                            Track Order
                        </button>
                    </form>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Searching for your order...</p>
                    </div>
                )}

                {/* Not Found State */}
                {notFound && !loading && (
                    <div className="no-order-found">
                        <div className="no-order-icon">📭</div>
                        <h3>Order Not Found</h3>
                        <p>We couldn't find an order with that ID. Please check and try again.</p>
                    </div>
                )}

                {/* Order Details */}
                {order && !loading && (
                    <div className="order-details-container">
                        {/* Order Summary Card */}
                        <div className="tracking-card order-summary-card">
                            <div className="order-id-display">
                                <span>Order ID</span>
                                <strong>{order.id}</strong>
                            </div>
                            <div className="order-date">
                                Placed on {formatDate(order.created_at)}
                            </div>
                            <div className={`order-status-badge ${getStatusBadgeClass()}`}>
                                {order.status?.replace(/_/g, ' ')}
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="tracking-card status-timeline">
                            <h3>📍 Order Status</h3>
                            <div className="timeline-wrapper">
                                <div
                                    className="timeline-progress"
                                    style={{ width: getProgressWidth() }}
                                ></div>
                                {STATUS_STEPS.map((step, index) => {
                                    const currentStep = getCurrentStepIndex();
                                    const isCompleted = index < currentStep;
                                    const isCurrent = index === currentStep;

                                    return (
                                        <div
                                            key={step.key}
                                            className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                        >
                                            <div className="step-icon">{step.icon}</div>
                                            <div className="step-info">
                                                <span className="step-label">{step.label}</span>
                                                {(isCompleted || isCurrent) && order.tracking_history && (
                                                    <span className="step-time">
                                                        {order.tracking_history
                                                            .find(h => h.status.toLowerCase().includes(step.label.toLowerCase().split(' ')[0]))
                                                            ?.timestamp && formatTime(
                                                                order.tracking_history
                                                                    .find(h => h.status.toLowerCase().includes(step.label.toLowerCase().split(' ')[0]))
                                                                    .timestamp
                                                            )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Delivery Estimate */}
                        <div className="tracking-card delivery-estimate">
                            <h3>🚀 Estimated Delivery</h3>
                            <div className="estimate-date">
                                {formatDate(order.estimated_delivery)}
                            </div>
                            {order.status !== 'delivered' && (
                                <div className="estimate-countdown">
                                    <div className="countdown-item">
                                        <span className="number">{countdown.days}</span>
                                        <span className="label">Days</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="number">{countdown.hours}</span>
                                        <span className="label">Hours</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="number">{countdown.mins}</span>
                                        <span className="label">Mins</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shipping Details */}
                        <div className="tracking-card shipping-details">
                            <h3>📬 Shipping Details</h3>
                            <div className="shipping-info">
                                <div className="info-row">
                                    <span className="icon">👤</span>
                                    <div className="info-content">
                                        <span className="info-label">Name</span>
                                        <span className="info-value">{order.customer_name}</span>
                                    </div>
                                </div>
                                <div className="info-row">
                                    <span className="icon">📍</span>
                                    <div className="info-content">
                                        <span className="info-label">Address</span>
                                        <span className="info-value">{order.shipping_description}</span>
                                    </div>
                                </div>
                                <div className="info-row">
                                    <span className="icon">📞</span>
                                    <div className="info-content">
                                        <span className="info-label">Phone</span>
                                        <span className="info-value">{order.contact_phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Preview */}
                        <div className="tracking-card product-preview">
                            <h3>🎁 Items in Order</h3>
                            <div className="product-preview-list">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="product-preview-item">
                                        <img
                                            src={item.image_url || 'https://via.placeholder.com/80'}
                                            alt={item.name}
                                            className="product-image"
                                        />
                                        <div className="product-info">
                                            <h4>{item.name}</h4>
                                            <p className="product-meta">
                                                Size: {item.size} • Qty: {item.quantity}
                                            </p>
                                            <p className="product-price">₹{item.price_at_purchase}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Courier Info */}
                        <div className="tracking-card courier-section">
                            <h3>🚛 Courier Partner</h3>
                            <div className="courier-info">
                                <div className="courier-partner">
                                    <div className="courier-logo">
                                        {order.courier_partner?.substring(0, 2).toUpperCase() || 'BD'}
                                    </div>
                                    <div className="courier-details">
                                        <h4>{order.courier_partner}</h4>
                                        <p>Tracking: {order.tracking_number || order.id.substring(0, 12)}</p>
                                    </div>
                                </div>
                                {order.courier_tracking_link && (
                                    <a
                                        href={order.courier_tracking_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="track-external-btn"
                                    >
                                        Track on Courier Site →
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Tracking History */}
                        <div className="tracking-card tracking-history">
                            <h3>📋 Tracking Updates</h3>
                            <div className="history-list">
                                {order.tracking_history?.map((update, idx) => (
                                    <div key={idx} className={`history-item ${idx === 0 ? 'latest' : ''}`}>
                                        <div className="history-dot"></div>
                                        <div className="history-content">
                                            <div className="history-status">{update.status}</div>
                                            <div className="history-message">
                                                {update.message}
                                                {update.location && ` • ${update.location}`}
                                            </div>
                                            <div className="history-time">{formatTime(update.timestamp)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="tracking-card notifications-section">
                            <h3>🔔 Notification Preferences</h3>
                            <div className="notification-toggles">
                                <div className="toggle-row">
                                    <span className="toggle-label">
                                        <span className="icon">✉️</span> Email Updates
                                    </span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notifications.email}
                                            onChange={(e) => setNotifications(prev => ({
                                                ...prev,
                                                email: e.target.checked
                                            }))}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-row">
                                    <span className="toggle-label">
                                        <span className="icon">💬</span> SMS Alerts
                                    </span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notifications.sms}
                                            onChange={(e) => setNotifications(prev => ({
                                                ...prev,
                                                sms: e.target.checked
                                            }))}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-row">
                                    <span className="toggle-label">
                                        <span className="icon">📱</span> In-App Notifications
                                    </span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notifications.inApp}
                                            onChange={(e) => setNotifications(prev => ({
                                                ...prev,
                                                inApp: e.target.checked
                                            }))}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Help & Support */}
                        <div className="tracking-card help-section">
                            <h3>💬 Need Help?</h3>
                            <div className="help-actions">
                                <button className="help-btn primary">
                                    📞 Contact Support
                                </button>
                                <button className="help-btn secondary">
                                    🚨 Report an Issue
                                </button>
                                <button className="help-btn secondary">
                                    ❓ FAQ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
