import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card cursor-pointer" onClick={() => navigate('/new-order')}>
                    <h2 className="text-xl font-bold">New Order</h2>
                    <p className="text-text-muted">Place a new order with your distributor</p>
                </div>
                <div className="card cursor-pointer" onClick={() => navigate('/orders')}>
                    <h2 className="text-xl font-bold">Order History</h2>
                    <p className="text-text-muted">View past orders and their status</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
