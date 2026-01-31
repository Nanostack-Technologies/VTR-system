import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrderHistory from './pages/OrderHistory';
import NewOrder from './pages/NewOrder';
import BottomNav from './components/BottomNav';

const Layout = ({ children }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/login';

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans pb-20 md:pb-0">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl md:border-x md:border-gray-100 overflow-hidden relative">
        {children}
      </div>
      {showNav && (
        <div className="max-w-md mx-auto md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
};

function App() {
  const isAuthenticated = () => !!localStorage.getItem('access_token');

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/new-order" element={<PrivateRoute><NewOrder /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
