import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        category_id: '',
        image_url: '',
        stock: '',
        weight: '',
        height: '',
        breadth: '',
        length: '',
        is_featured: false
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    ...formData,
                    price: parseFloat(formData.price),
                    original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                    stock: formData.stock ? parseInt(formData.stock) : 0,
                    weight: formData.weight ? parseFloat(formData.weight) : null,
                    height: formData.height ? parseFloat(formData.height) : null,
                    breadth: formData.breadth ? parseFloat(formData.breadth) : null,
                    length: formData.length ? parseFloat(formData.length) : null
                }]);

            if (error) throw error;

            alert('Product added successfully!');
            navigate('/products');
        } catch (error) {
            alert('Error adding product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <div className="admin-header">
                <h1 className="admin-title">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '8px' }}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            className="form-input"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Original Price (₹)</label>
                        <input
                            type="number"
                            name="original_price"
                            className="form-input"
                            value={formData.original_price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category_id"
                        className="form-select"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="url"
                        name="image_url"
                        className="form-input"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        className="form-textarea"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Stock Count */}
                <div className="form-group">
                    <label>Stock Count</label>
                    <input
                        type="number"
                        name="stock"
                        className="form-input"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter available stock quantity"
                        min="0"
                    />
                </div>

                {/* Product Dimensions */}
                <h3 style={{ color: '#888', marginBottom: '1rem', marginTop: '1.5rem', fontSize: '1rem', textTransform: 'uppercase' }}>Product Dimensions</h3>
                <div className="form-group-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '1 1 45%' }}>
                        <label>Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            className="form-input"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="e.g. 0.5"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 45%' }}>
                        <label>Length (cm)</label>
                        <input
                            type="number"
                            name="length"
                            className="form-input"
                            value={formData.length}
                            onChange={handleChange}
                            placeholder="e.g. 30"
                            step="0.1"
                            min="0"
                        />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 45%' }}>
                        <label>Breadth (cm)</label>
                        <input
                            type="number"
                            name="breadth"
                            className="form-input"
                            value={formData.breadth}
                            onChange={handleChange}
                            placeholder="e.g. 20"
                            step="0.1"
                            min="0"
                        />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 45%' }}>
                        <label>Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            className="form-input"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="e.g. 10"
                            step="0.1"
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleChange}
                        />
                        Feature this product on homepage?
                    </label>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
