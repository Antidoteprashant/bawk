import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            if (onLoginSuccess) onLoginSuccess(data.user);
        }
        setLoading(false);
    };

    return (
        <div className="login-form-container" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #333', borderRadius: '8px', background: '#222' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Login</h3>
            {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', background: '#ff3e6c', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
