import React from 'react';
import './CategoryGrid.css';
import placeholder from '../assets/product_placeholder.png';

const categories = [
    { id: 1, name: 'Action Figures', image: placeholder },
    { id: 2, name: 'Wooden Katana', image: placeholder },
    { id: 3, name: 'Keychains', image: placeholder },
    // { id: 4, name: 'Apparel', image: placeholder },
    { id: 5, name: 'Mousepads', image: placeholder },
    { id: 6, name: 'WATCH', image: placeholder },
];

const CategoryGrid = () => {
    return (
        <section className="section categories-section" id="categories">
            <div className="container">
                <h2 className="section-title">Categories</h2>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <div key={cat.id} className="category-card">
                            <div className="category-image">
                                <img src={cat.image} alt={cat.name} />
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
