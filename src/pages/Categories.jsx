import React from 'react';
import CategoryGrid from '../components/CategoryGrid';

const Categories = () => {
    return (
        <div style={{ paddingTop: '40px', minHeight: '60vh' }}>
            <div className="container">
                <h1 className="section-title">Explore Categories</h1>
            </div>
            <CategoryGrid />
        </div>
    );
};
export default Categories;
