import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrderHistory from './pages/OrderHistory';
import NewOrder from './pages/NewOrder';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

const Layout = ({ children }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/login';

  return (
    <div className="app-container">
      {children}
      {showNav && <BottomNav />}
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
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
