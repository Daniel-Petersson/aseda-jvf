import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountDetails from './pages/AccountDetails';
import Algbana from './pages/Algbana';
import Inskjutning from './pages/Inskjutning';
import Viltmalsbana from './pages/Viltmalsbana';
import TrappSkeet from './pages/TrappSkeet';
import JagarExamen from './pages/JagarExamen';
import Calendar from './pages/Calendar';
import NewsPage from './pages/News';
import MemberArea from './pages/MemberArea';
import AdminPanel from './pages/AdminPanel';
import ShootingSession from './components/common/ShootingSession';
import ProtectedRoute from './components/common/ProtectedRoute';
import NewsManagement from './components/admin/NewsManagement';
import MemberManagement from './components/admin/MemberManagement';
import { AuthProvider } from './utils/AuthContext';
import { Provider } from 'react-redux';
import store from './store/store';

function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accountDetails" element={<ProtectedRoute roles={['USER', 'ADMIN', 'INSTRUCTOR']} element={<AccountDetails />} />} />
            <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']} element={<AdminPanel />} />} />
            <Route path="/member" element={<ProtectedRoute roles={['USER', 'ADMIN', 'INSTRUCTOR']} element={<MemberArea />} />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/algbana" element={<Algbana />} />
            <Route path="/inskjutning" element={<Inskjutning />} />
            <Route path="/viltmalsbana" element={<Viltmalsbana />} />
            <Route path="/trappSkeet" element={<TrappSkeet />} />
            <Route path="/jagarExamen" element={<JagarExamen />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/shootingSession" element={<ProtectedRoute roles={['ADMIN', 'INSTRUCTOR']} element={<ShootingSession />} />} />
            <Route path="/newsManagement" element={<ProtectedRoute roles={['ADMIN']} element={<NewsManagement />} />} />
            <Route path="/memberManagement" element={<ProtectedRoute roles={['ADMIN']} element={<MemberManagement />} />} />
          </Routes>
        </Layout>
        </Router>
      </Provider>
    </AuthProvider>
  );
}

export default App;