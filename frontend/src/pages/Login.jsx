import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { LayoutGrid, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
            <div className="card" style={{ width: '100%', maxWidth: 400, border: 'none', boxShadow: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                    <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 16, borderRadius: '50%', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutGrid size={32} color="#4f46e5" />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800 }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', color: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 16, textAlign: 'center', fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14, color: 'var(--text-muted)' }}>Username</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)', fontSize: 16, outline: 'none' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14, color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)', fontSize: 16, outline: 'none' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                        Sign In <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </button>
                </form>

                <div style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <p>Demo Credentials:</p>
                    <p>Distributor: <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>distributor / password123</span></p>
                    <p>Retailer: <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>retailer / password123</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
