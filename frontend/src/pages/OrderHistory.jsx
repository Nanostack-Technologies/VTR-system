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
            case 'accepted': return 'badge-success'; // Using success for accepted for now
            case 'delivered': return 'badge-success';
            case 'cancelled': return 'badge-error';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Order History</h1>

            {orders.length === 0 ? (
                <div className="card text-center p-12 text-text-muted">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="card p-0 overflow-hidden border border-border-color">
                            {/* Order Header */}
                            <div
                                className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                                onClick={() => toggleOrder(order.id)}
                            >
                                <div className="flex items-center gap-4 mb-2 md:mb-0">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Order #{order.id}</div>
                                        <div className="text-sm text-text-muted flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`badge ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <div className="font-bold text-lg">
                                        ₹{parseFloat(order.total_amount).toFixed(2)}
                                    </div>
                                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {/* Order Details (Collapsible) */}
                            {expandedOrder === order.id && (
                                <div className="bg-gray-50/50 border-t border-border-color p-4 animate-fade-in">
                                    <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-text-muted">Order Items</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{item.product_name}</span>
                                                    <span className="text-text-muted">x {item.quantity}</span>
                                                </div>
                                                <div className="font-mono">
                                                    ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-border-color flex justify-between font-bold">
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
