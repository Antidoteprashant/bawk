import React from 'react';
import CategoryGrid from '../components/CategoryGrid';

const Categories = ({ addToCart, buyNow }) => {
    return (
        <div style={{ paddingTop: '40px', minHeight: '60vh' }}>
            <div className="container">
                <h1 className="section-title">Explore Categories</h1>
            </div>
            <CategoryGrid addToCart={addToCart} buyNow={buyNow} />
        </div>
    );
};
export default Categories;
