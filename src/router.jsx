import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import News from './pages/News';
import Booking from './pages/Booking';
import MemberArea from './pages/MemberArea.jsx';
import AdminPanel from './pages/AdminPanel';
import Algbana from './pages/Algbana';
import Inskjutning from './pages/Inskjutning';
import Viltmalsbana from './pages/Viltmalsbana';
import TrappSkeet from './pages/TrappSkeet';
import JagarExamen from './pages/JagarExamen';
import Calendar from './pages/Calendar';
import Register from './pages/Register';
import AccountDetails from './pages/AccountDetails';
import NewsPage from './pages/News';

// import ProtectedRoute from './components/common/ProtectedRoute'; // Commented out

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="news" element={<News />} />
          <Route path="booking" element={<Booking />} />
          <Route path="member" element={<MemberArea />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="algbana" element={<Algbana />} />
          <Route path="inskjutning" element={<Inskjutning />} />
          <Route path="viltmalsbana" element={<Viltmalsbana />} />
          <Route path="trappSkeet" element={<TrappSkeet />} />
          <Route path="jagarExamen" element={<JagarExamen />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="register" element={<Register />} />
          <Route path="accountDetails" element={<AccountDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
