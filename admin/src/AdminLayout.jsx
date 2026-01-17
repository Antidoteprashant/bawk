import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Admin.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    BAWK
                </div>
                <nav className="admin-nav">
                    <NavLink to="/" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        Products
                    </NavLink>
                    <NavLink to="/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        Orders
                    </NavLink>
                    <NavLink to="/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        Users
                    </NavLink>
                    <a href="/" className="admin-nav-link">
                        View Live Site
                    </a>
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
