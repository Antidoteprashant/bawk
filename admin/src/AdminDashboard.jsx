import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabaseClient';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        // In a real app, optimize this query or use pagination
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error deleting product");
            console.error(error);
        } else {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Products</h1>
                <Link to="/products/new" className="btn-primary">
                    + Add Product
                </Link>
            </div>

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No products found. Add your first one!</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/40'}
                                            alt=""
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <span className="status-badge status-success">Active</span>
                                    </td>
                                    <td>
                                        <button style={{ marginRight: '0.5rem' }}>Edit</button>
                                        <button style={{ color: '#e53935' }} onClick={() => deleteProduct(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
