import { useState, useEffect } from 'react';
import { fetchProducts, createOrder } from '../api';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewOrder = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const { data } = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart(prev => ({
            ...prev,
            [product.id]: {
                product,
                quantity: (prev[product.id]?.quantity || 0) + 1
            }
        }));
    };

    const updateQuantity = (productId, change) => {
        setCart(prev => {
            const newCart = { ...prev };
            const item = newCart[productId];

            if (!item) return prev;

            const newQuantity = item.quantity + change;

            if (newQuantity <= 0) {
                delete newCart[productId];
            } else {
                newCart[productId] = { ...item, quantity: newQuantity };
            }
            return newCart;
        });
    };

    const calculateTotal = () => {
        return Object.values(cart).reduce((sum, item) => {
            return sum + (parseFloat(item.product.base_price) * item.quantity);
        }, 0);
    };

    const handlePlaceOrder = async () => {
        setSubmitting(true);
        try {
            const items = Object.values(cart).map(item => ({
                product: item.product.id,
                quantity: item.quantity
            }));

            await createOrder({ items });
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    const cartItemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div style={{ paddingBottom: 100 }}>
            <header className="dashboard-header" style={{ paddingBottom: 0 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>New Order</h1>
                <p style={{ color: 'var(--text-muted)' }}>Browse catalog</p>
            </header>

            {/* Product List */}
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                    />
                ))}
            </div>

            {/* Floating Cart Button */}
            <button
                className="floating-cart-btn"
                onClick={() => setIsCartOpen(true)}
            >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                    <span style={{
                        position: 'absolute', top: 0, right: 0,
                        background: 'var(--error)', width: 20, height: 20,
                        borderRadius: 10, fontSize: 10, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        {cartItemCount}
                    </span>
                )}
            </button>

            {/* Mobile Cart Overlay */}
            {isCartOpen && (
                <div className="mobile-cart-overlay">
                    <div className="mobile-cart-panel" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Your Order</h2>
                            <button onClick={() => setIsCartOpen(false)} style={{ padding: 4 }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div style={{ marginBottom: 20 }}>
                            {Object.keys(cart).length === 0 ? (
                                <div className="text-center text-muted py-8">Cart is empty</div>
                            ) : (
                                Object.values(cart).map(({ product, quantity }) => (
                                    <div key={product.id} className="cart-item">
                                        <div>
                                            <div className="font-bold">{product.name}</div>
                                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>₹{product.base_price} / {product.unit}</div>
                                        </div>
                                        <div className="quant-control">
                                            <button className="quant-btn" onClick={() => updateQuantity(product.id, -1)}>-</button>
                                            <span style={{ width: 24, textAlign: 'center', fontSize: 14 }}>{quantity}</span>
                                            <button className="quant-btn" onClick={() => updateQuantity(product.id, 1)}>+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="total-row">
                            <span>Total</span>
                            <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: 16, fontSize: 18 }}
                            disabled={Object.keys(cart).length === 0 || submitting}
                        >
                            {submitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewOrder;
