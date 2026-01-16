import React, { useEffect, useState } from 'react';
import './CategoryGrid.css';
import placeholder from '../assets/product_placeholder.png';
import { supabase } from '../lib/supabaseClient';

const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);

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

    // Fallback if no categories in DB, show nothing or maybe show hardcoded? 
    // Let's hide if empty to avoid broken UI.
    if (categories.length === 0) return null;

    return (
        <section className="section categories-section" id="categories">
            <div className="container">
                <h2 className="section-title">Categories</h2>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <div key={cat.id} className="category-card">
                            <div className="category-image">
                                <img src={placeholder} alt={cat.name} />
                            </div>
                            <h3 className="category-name">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
