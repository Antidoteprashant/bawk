import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import './Admin.css';

const AdminLayout = () => {
    const { user, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

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
                    <div className="avatar">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
                    <span className="user-email">{user?.email || 'admin@bawk.com'}</span>
                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
