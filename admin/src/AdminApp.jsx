import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AddProduct from './AddProduct';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const AdminApp = () => {
    return (
        <Router basename="/admin">
            <Routes>
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminDashboard />} />
                    <Route path="products/new" element={<AddProduct />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AdminApp;
