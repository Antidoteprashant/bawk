import React, { useEffect, useState } from 'react';
import './ProductSection.css';
import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';

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
