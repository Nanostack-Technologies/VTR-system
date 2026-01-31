import { useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            {/* Header */}
            <header className="mb-8 pt-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Good Morning,</h1>
                <p className="text-lg text-gray-500">Ready to restock your shop?</p>
            </header>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div
                    onClick={() => navigate('/new-order')}
                    className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-indigo-200 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95 flex flex-col justify-between h-40"
                >
                    <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                        <PlusCircle size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">New Order</h3>
                        <p className="text-sm opacity-90">Browse catalog</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/orders')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95 flex flex-col justify-between h-40"
                >
                    <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">History</h3>
                        <p className="text-sm text-gray-500">Track orders</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Banners */}
            <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="font-bold text-xl mb-1">Weekly Offer</h3>
                    <p className="opacity-90 text-sm mb-4">Get 5% off on bulk sugar orders this week!</p>
                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-md active:opacity-90">
                        View Offer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
