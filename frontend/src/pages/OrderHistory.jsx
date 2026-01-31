import { useState, useEffect } from 'react';
import { fetchOrders } from '../api';
import { Package, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const { data } = await fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleOrder = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'badge-warning';
            case 'accepted': return 'badge-success';
            case 'delivered': return 'badge-success';
            case 'cancelled': return 'badge-error';
            default: return '';
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading orders...</div>;

    return (
        <div style={{ paddingBottom: 100 }}>
            <header className="dashboard-header" style={{ paddingBottom: 16 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>Order History</h1>
            </header>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p style={{ fontSize: 16 }}>No orders found.</p>
                </div>
            ) : (
                <div style={{ padding: 20, display: 'grid', gap: 12 }}>
                    {orders.map((order) => (
                        <div key={order.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Order Header */}
                            <div
                                style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => toggleOrder(order.id)}
                            >
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ background: '#f1f5f9', padding: 8, borderRadius: 8, color: 'var(--primary)' }}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>Order #{order.id}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Calendar size={12} />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: 15 }}>₹{parseFloat(order.total_amount).toFixed(0)}</div>
                                        <span className={`badge ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    {expandedOrder === order.id ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                                </div>
                            </div>

                            {/* Order Details (Collapsible) */}
                            {expandedOrder === order.id && (
                                <div style={{ background: '#f8fafc', borderTop: '1px solid var(--border-color)', padding: 16 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12, letterSpacing: 0.5 }}>Items</h4>
                                    <div style={{ display: 'grid', gap: 8 }}>
                                        {order.items.map((item) => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <div>
                                                    <span style={{ fontWeight: 500 }}>{item.product_name}</span>
                                                    <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>x {item.quantity}</span>
                                                </div>
                                                <div style={{ fontFamily: 'monospace' }}>
                                                    ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                                        <span>Total</span>
                                        <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
