import React from 'react';
import './ProductSection.css';
import placeholder from '../assets/product_placeholder.png';

const ProductCard = ({ product, addToCart }) => {
    return (
        <div className="product-card">
            <div className="product-image">
                <img src={placeholder} alt={product.name} />
                <span className="sale-badge">SALE</span>
                <div className="product-actions">
                    <button title="Add to Cart" onClick={() => addToCart(product)}>Add</button>
                    <button title="Wishlist">Like</button>
                </div>
            </div>
            <div className="product-info">
                <div className="product-cat">Action Figure</div>
                <h4 className="product-title">{product.name}</h4>
                <div className="product-price">
                    <span className="old-price">₹{product.originalPrice}</span>
                    <span className="new-price">₹{product.price}</span>
                </div>
            </div>
        </div>
    );
};

const ProductSection = ({ title, id, addToCart }) => {
    // Dummy data
    const products = [
        { id: 1, name: 'Zoro Wano Arc', price: 1299, originalPrice: 1999 },
        { id: 2, name: 'Luffy Gear 5', price: 1599, originalPrice: 2499 },
        { id: 3, name: 'Naruto Sage Mode', price: 999, originalPrice: 1499 },
        { id: 4, name: 'Tanjiro Kamado', price: 1199, originalPrice: 1699 },
    ];

    return (
        <section className="section product-section" id={id}>
            <div className="container">
                <h2 className="section-title">{title}</h2>
                <div className="product-grid">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} addToCart={addToCart} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
