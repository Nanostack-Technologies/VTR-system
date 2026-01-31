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
        <div className="min-h-screen flex items-center justify-center">
            <Loader className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="container py-8 pb-24 relative min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">New Order</h1>
                    <p className="text-text-muted">Select products to add to your order</p>
                </div>
                <button
                    className="relative btn btn-primary md:hidden"
                    onClick={() => setIsCartOpen(true)}
                >
                    <ShoppingCart size={20} />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </header>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                    />
                ))}
            </div>

            {/* Floating Cart Panel (Desktop: Fixed Right, Mobile: Bottom Sheet/Overlay) */}
            <div className={`
        fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300
        ${isCartOpen || Object.keys(cart).length > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:pointer-events-auto md:opacity-100'}
        md:bg-transparent md:backdrop-blur-none md:inset-auto md:right-8 md:bottom-8 md:w-96
      `}>
                <div className={`
          absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white md:bg-white/90 md:backdrop-blur-xl shadow-2xl 
          transform transition-transform duration-300 flex flex-col
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          md:relative md:rounded-2xl md:border md:border-white/50
        `}>
                    {/* Cart Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <ShoppingCart size={20} /> Current Order
                        </h2>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {Object.keys(cart).length === 0 ? (
                            <div className="text-center text-gray-400 py-10">
                                Cart is empty
                            </div>
                        ) : (
                            Object.values(cart).map(({ product, quantity }) => (
                                <div key={product.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                    <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-gray-500">₹{product.base_price} / {product.unit}</div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(product.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold w-4 text-center">{quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(product.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Footer */}
                    <div className="p-4 border-t bg-gray-50/50 rounded-b-2xl">
                        <div className="flex justify-between items-center mb-4 text-lg font-bold">
                            <span>Total:</span>
                            <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={Object.keys(cart).length === 0 || submitting}
                            className="btn btn-primary w-full py-3 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewOrder;
