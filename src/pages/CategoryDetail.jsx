import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';
import '../components/ProductSection.css';

const CategoryDetail = ({ addToCart, buyNow }) => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                // Fetch category details
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('id', categoryId)
                    .single();

                if (catError) throw catError;
                const mappedCat = {
                    ...catData,
                    name: catData.name.toLowerCase() === 'cosplay' ? 'WATCH' : catData.name
                };
                setCategory(mappedCat);

                // Fetch products for this category
                const { data: prodData, error: prodError } = await supabase
                    .from('products')
                    .select('*, categories(name)')
                    .eq('category_id', categoryId);

                if (prodError) throw prodError;
                setProducts(prodData || []);
            } catch (error) {
                console.error('Error fetching category data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
                <h2 style={{ color: '#fff' }}>Loading...</h2>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
                <h2 style={{ color: '#fff' }}>Category not found</h2>
                <button
                    onClick={() => navigate('/categories')}
                    style={{ marginTop: '1rem', background: '#00e676', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Back to Categories
                </button>
            </div>
        );
    }

    return (
        <section className="section" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 className="section-title" style={{ margin: 0 }}>{category.name}</h1>
                    <button
                        onClick={() => navigate('/categories')}
                        style={{ background: 'none', border: '1px solid #444', color: '#aaa', padding: '0.6rem 1.2rem', cursor: 'pointer', borderRadius: '4px' }}
                    >
                        Back to Categories
                    </button>
                </div>

                {products.length > 0 ? (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                addToCart={addToCart}
                                buyNow={buyNow}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <p style={{ color: '#aaa', fontSize: '1.2rem' }}>No products found in this category.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryDetail;
