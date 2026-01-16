import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Admin.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    MIMICON ADMIN
                </div>
                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        Products
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        Orders
                    </NavLink>
                    <NavLink to="/" className="admin-nav-link">
                        View Live Site
                    </NavLink>
                </nav>
                <div className="admin-user">
                    <div className="avatar">A</div>
                    <span>admin@themimicon.com</span>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
