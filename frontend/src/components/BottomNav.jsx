import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, ShoppingBag, User } from 'lucide-react';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/new-order', label: 'Order', icon: PlusCircle },
        { path: '/orders', label: 'History', icon: ShoppingBag },
        { path: '/profile', label: 'Profile', icon: User }, // Placeholder
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden">
            <div className="flex justify-between items-center h-16">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-xs font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
