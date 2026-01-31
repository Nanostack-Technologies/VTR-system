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
        <div className="min-h-screen flex items-center justify-center bg-bg-color">
            <div className="card w-full max-w-md animate-fade-in glass-panel">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
                        <LayoutGrid size={32} color="var(--primary)" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-text-muted">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-error/10 text-error p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Username</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-2">
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-text-muted">
                    <p>Demo Credentials:</p>
                    <p>Distributor: <span className="font-mono">distributor / password123</span></p>
                    <p>Retailer: <span className="font-mono">retailer / password123</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
