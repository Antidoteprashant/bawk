import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Sign up user
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                }
            }
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            // 2. Update profile with extra details immediately
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    zip: formData.zip
                })
                .eq('id', data.user.id);

            if (profileError) {
                console.error("Error saving profile details:", profileError);
                // Continue anyway, user is created
            }

            if (onRegisterSuccess) onRegisterSuccess(data.user);
        }
        setLoading(false);
    };

    return (
        <div className="login-form-container" style={{ marginBottom: '2rem', padding: '2rem', border: '1px solid #333', borderRadius: '8px', background: '#222' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#fff' }}>Create Account</h3>
            {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                />

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                    />
                </div>

                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                />

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                    />
                    <input
                        type="text"
                        name="zip"
                        placeholder="ZIP Code"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', border: 'none', background: '#00e676', color: '#000', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                >
                    {loading ? 'Creating Account...' : 'Register & Continue'}
                </button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center', color: '#aaa' }}>
                <span>Already have an account? </span>
                <button
                    onClick={onSwitchToLogin}
                    style={{ background: 'none', border: 'none', color: '#ff3e6c', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Login here
                </button>
            </div>
        </div>
    );
};

export default Register;
