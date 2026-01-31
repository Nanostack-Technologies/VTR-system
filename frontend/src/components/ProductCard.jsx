import { Plus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <div className="product-row">
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{product.name}</h3>
                    <span className="badge badge-category">{product.category}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {product.unit}
                </div>
            </div>

            <div className="product-row" style={{ marginTop: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{product.base_price}
                </div>
                <button
                    onClick={() => onAddToCart(product)}
                    className="btn-primary"
                    style={{ width: 32, height: 32, padding: 0, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
