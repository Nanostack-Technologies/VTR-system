import { useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            <header className="dashboard-header">
                <h1 className="greet-text">Good Morning,</h1>
                <p className="sub-greet">Ready to restock your shop?</p>
            </header>

            <div className="quick-actions">
                <div
                    onClick={() => navigate('/new-order')}
                    className="action-card action-primary"
                >
                    <div style={{ background: 'rgba(255,255,255,0.2)', width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlusCircle size={24} color="white" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>New Order</h3>
                        <p style={{ fontSize: 13, opacity: 0.9 }}>Browse catalog</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/orders')}
                    className="action-card action-secondary"
                >
                    <div style={{ background: '#fff7ed', width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={24} color="#ea580c" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>History</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Track orders</p>
                    </div>
                </div>
            </div>

            <div className="promo-banner">
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Weekly Offer</h3>
                <p style={{ opacity: 0.9, fontSize: 14, marginBottom: 16 }}>Get 5% off on bulk sugar orders this week!</p>
                <button style={{ background: 'white', color: '#7c3aed', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                    View Offer
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
