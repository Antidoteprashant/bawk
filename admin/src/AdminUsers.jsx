import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabaseClient';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="admin-header">
                <h1 className="admin-title">Users</h1>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Role</th>
                            <th>Joined Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No users found (Profiles table might be empty).</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td><small>{user.id.slice(0, 8)}...</small></td>
                                    <td>{user.email || 'N/A'}</td>
                                    <td>{user.phone || '-'}</td>
                                    <td>{user.city ? `${user.city}, ${user.zip}` : '-'}</td>
                                    <td>
                                        <span className={`status-badge ${user.role === 'admin' ? 'status-success' : 'status-warning'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsers;
