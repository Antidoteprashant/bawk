import React, { useEffect, useState } from 'react';
import './CategoryGrid.css';
import placeholder from '../assets/product_placeholder.png';
import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';

const CategoryGrid = ({ addToCart, buyNow, selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) {
                console.error('Error fetching categories:', error);
                return;
            }
            if (data) {
                setCategories(data);
            }
        };
        fetchCategories();
    }, []);

    // Watch for selectedCategory changes to fetch products
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            if (!selectedCategory) {
                setCategoryProducts([]);
                return;
            }

            setProductsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .eq('category_id', selectedCategory.id);

            if (error) {
                console.error('Error fetching products for category:', error);
            } else {
                setCategoryProducts(data || []);
            }
            setProductsLoading(false);
        };

        fetchCategoryProducts();
    }, [selectedCategory]);

    const handleCategoryClick = (category) => {
        if (selectedCategory?.id === category.id) {
            onSelectCategory(null); // Deselect
        } else {
            onSelectCategory(category);
        }
    };

    if (categories.length === 0) return null;

    return (
        <section className="section categories-section" id="categories">
            <div className="container">
                <h2 className="section-title">Categories</h2>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-card ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat)}
                            style={selectedCategory?.id === cat.id ? { border: '2px solid #00e676', transform: 'scale(1.05)' } : {}}
                        >
                            <div className="category-image">
                                <img src={placeholder} alt={cat.name} />
                            </div>
                            <h3 className="category-name">{cat.name}</h3>
                        </button>
                    ))}
                </div>

                {/* Selected Category Products Section */}
                {selectedCategory && (
                    <div style={{ marginTop: '3rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>Products in <span style={{ color: '#00e676' }}>{selectedCategory.name}</span></h3>
                            <button
                                onClick={() => onSelectCategory(null)}
                                style={{ background: 'none', border: '1px solid #444', color: '#aaa', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                Clear Selection
                            </button>
                        </div>

                        {productsLoading ? (
                            <p style={{ color: '#aaa', textAlign: 'center' }}>Loading products...</p>
                        ) : categoryProducts.length > 0 ? (
                            <div className="product-grid">
                                {categoryProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        addToCart={addToCart}
                                        buyNow={buyNow}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#aaa', textAlign: 'center' }}>No products found in this category.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryGrid;
