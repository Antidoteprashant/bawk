import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AddProduct from './AddProduct';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminLogin from './AdminLogin';

const AdminApp = () => {
    return (
        <AdminAuthProvider>
            <Router basename="/admin">
                <Routes>
                    {/* Public Route - Login */}
                    <Route path="/login" element={<AdminLogin />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminDashboard />} />
                        <Route path="products/new" element={<AddProduct />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                    </Route>
                </Routes>
            </Router>
        </AdminAuthProvider>
    );
};

export default AdminApp;
