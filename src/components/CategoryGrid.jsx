import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryGrid.css';
import placeholder from '../assets/product_placeholder.png';
import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';

const CategoryGrid = ({ addToCart, buyNow }) => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) {
                console.error('Error fetching categories:', error);
                return;
            }
            if (data) {
                const mappedData = data.map(cat => ({
                    ...cat,
                    name: cat.name.toLowerCase() === 'cosplay' ? 'WATCH' : cat.name
                }));
                setCategories(mappedData);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/category/${category.id}`);
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
                            className="category-card"
                            onClick={() => handleCategoryClick(cat)}
                        >
                            <div className="category-image">
                                <img src={placeholder} alt={cat.name} />
                            </div>
                            <h3 className="category-name">{cat.name}</h3>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
