import React from 'react';
import './ProductSection.css'; // Reusing styles from ProductSection
import placeholder from '../assets/product_placeholder.png'; // Make sure path is correct relatively

const ProductCard = ({ product, addToCart, buyNow }) => {
    return (
        <div className="product-card">
            <div className="product-image">
                <img
                    src={product.image_url || placeholder}
                    alt={product.name}
                    onError={(e) => e.target.src = placeholder}
                />
                {product.is_sale && <span className="sale-badge">SALE</span>}
                <div className="product-actions">
                    <button title="Buy Now" style={{ background: '#00e676', color: '#000', fontWeight: 'bold' }} onClick={() => buyNow(product)}>Buy</button>
                    <button title="Add to Cart" onClick={() => addToCart(product)}>Add</button>
                </div>
            </div>
            <div className="product-info">
                <div className="product-cat">{product.categories?.name || 'Anime'}</div>
                <h4 className="product-title">{product.name}</h4>
                <div className="product-price">
                    {product.original_price && <span className="old-price">₹{product.original_price}</span>}
                    <span className="new-price">₹{product.price}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
