import { Plus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="card flex flex-col h-full hover:shadow-lg transition-all duration-300">
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                    <span className="badge badge-success">{product.category}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                    Unit: {product.unit}
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="text-xl font-bold text-primary">
                    ₹{product.base_price}
                </div>
                <button
                    onClick={() => onAddToCart(product)}
                    className="btn btn-primary btn-sm rounded-full p-2"
                    aria-label="Add to cart"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
