
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Phone, MapPin, Shield } from 'lucide-react';
import { fetchMe } from '../api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchMe().then(res => setUser(res.data)).catch(console.error);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    if (!user) return <div style={{ padding: 40, textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div style={{ paddingBottom: 100 }}>
            <header className="dashboard-header">
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Profile</h1>
            </header>

            <div style={{ padding: 20 }}>
                {/* Profile Card */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 30, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={30} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: 'capitalize' }}>{user.username}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, textTransform: 'capitalize' }}>{user.role} Account</p>
                    </div>
                </div>

                {/* Menu Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                        <Phone size={20} color="var(--text-muted)" />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>Support</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Contact your {user.role === 'retailer' ? 'distributor' : 'admin'}</div>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                        <MapPin size={20} color="var(--text-muted)" />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>Address</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Shop 12, Market Main Rd</div>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                        <Shield size={20} color="var(--text-muted)" />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>Privacy & Terms</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="card"
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, color: 'var(--error)', marginTop: 12, width: '100%', justifyContent: 'flex-start' }}
                    >
                        <LogOut size={20} />
                        <span style={{ fontWeight: 700 }}>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
