import React, { useEffect, useState } from 'react';
import './ProductSection.css';
import placeholder from '../assets/product_placeholder.png';
import { supabase } from '../lib/supabaseClient';

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

const ProductSection = ({ title, id, addToCart, buyNow }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            let query = supabase
                .from('products')
                .select('*, categories(name)');

            if (id === 'featured') {
                query = query.eq('is_featured', true);
            } else if (id === 'sale' || id === 'top-sale') {
                query = query.eq('is_sale', true);
            }

            // Limit to 4 for the section display
            query = query.limit(4);

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [id]);

    if (loading) {
        return (
            <section className="section product-section" id={id}>
                <div className="container">
                    <h2 className="section-title">{title}</h2>
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="section product-section" id={id}>
            <div className="container">
                <h2 className="section-title">{title}</h2>
                <div className="product-grid">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} addToCart={addToCart} buyNow={buyNow} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
