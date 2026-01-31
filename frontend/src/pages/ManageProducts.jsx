import { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api';
import ProductCard from '../components/ProductCard';
import { Plus, Edit2, Trash2, X, Loader } from 'lucide-react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: 'groceries', base_price: '', unit: 'kg' });
    const [submitting, setSubmitting] = useState(false);

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

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            base_price: product.base_price,
            unit: product.unit
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingProduct) {
                const { data } = await updateProduct(editingProduct.id, formData);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p));
            } else {
                const { data } = await createProduct(formData);
                setProducts(prev => [...prev, data]);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', category: 'groceries', base_price: '', unit: 'kg' });
        } catch (error) {
            console.error('Error saving product', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading products...</div>;

    return (
        <div style={{ paddingBottom: 100 }}>
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Products</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your inventory</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                    className="btn btn-primary"
                    style={{ borderRadius: '50%', width: 40, height: 40, padding: 0 }}
                >
                    <Plus size={24} />
                </button>
            </header>

            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="card" style={{ padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 700 }}>{product.name}</h3>
                                <span className="badge badge-category">{product.category}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => handleEdit(product)} style={{ padding: 4, color: 'var(--primary)' }}>
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(product.id)} style={{ padding: 4, color: 'var(--error)' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Unit: {product.unit}</span>
                            <span style={{ fontWeight: 800, fontSize: 16 }}>₹{product.base_price}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ background: 'white', width: '100%', borderRadius: '24px 24px 0 0', padding: 24, animation: 'slide-up 0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Name</label>
                                <input
                                    className="input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 8 }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Price (₹)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.base_price}
                                        onChange={e => setFormData({ ...formData, base_price: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 8 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Unit</label>
                                    <select
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'white' }}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="litre">litre</option>
                                        <option value="pcs">pcs</option>
                                        <option value="packet">packet</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'white' }}
                                >
                                    <option value="groceries">Groceries</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 8 }}
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
