import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, ShoppingBag, User } from 'lucide-react';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/new-order', label: 'Order', icon: PlusCircle },
        { path: '/orders', label: 'History', icon: ShoppingBag },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="bottom-nav">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                    <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
