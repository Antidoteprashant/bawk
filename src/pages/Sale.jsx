import React from 'react';
import ProductSection from '../components/ProductSection';

const Sale = ({ addToCart, buyNow }) => {
    return (
        <div style={{ paddingTop: '40px', minHeight: '60vh' }}>
            <ProductSection title="All Sale Items" id="sale" addToCart={addToCart} buyNow={buyNow} />
        </div>
    );
};
export default Sale;
