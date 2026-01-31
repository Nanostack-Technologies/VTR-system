import { useState, useEffect } from 'react';
import { fetchOrders, updateOrder } from '../api';
import { Package, Calendar, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

const DistributorOrders = () => {
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

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateOrder(id, { status });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
            <header className="dashboard-header">
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>Incoming Orders</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage retailer requests</p>
            </header>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p>No active orders.</p>
                </div>
            ) : (
                <div style={{ padding: 20, display: 'grid', gap: 12 }}>
                    {orders.map((order) => (
                        <div key={order.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div
                                style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => toggleOrder(order.id)}
                            >
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15 }}>Order #{order.id}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--primary)', marginTop: 2 }}>
                                        Retailer: {order.retailer_name || `Retailer ${order.retailer}`}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, fontSize: 15 }}>₹{parseFloat(order.total_amount).toFixed(0)}</div>
                                    <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div style={{ background: '#f8fafc', borderTop: '1px solid var(--border-color)', padding: 16 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Items</h4>
                                    <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                                        {order.items.map((item) => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <span>{item.quantity}x {item.product_name}</span>
                                                <span style={{ fontFamily: 'monospace' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {order.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--error)', color: 'var(--error)', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                                            >
                                                <X size={16} /> Reject
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'accepted')}
                                                style={{ flex: 1, padding: 10, borderRadius: 8, background: 'var(--success)', color: 'white', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                                            >
                                                <Check size={16} /> Accept
                                            </button>
                                        </div>
                                    )}
                                    {order.status === 'accepted' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                            style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--primary)', color: 'white', fontWeight: 600, marginTop: 16 }}
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DistributorOrders;
