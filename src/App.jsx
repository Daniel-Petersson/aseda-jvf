import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="booking" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="algbana" element={<Algbana />} />
          <Route path="inskjutning" element={<Inskjutning />} />
          <Route path="viltmalsbana" element={<Viltmalsbana />} />
          <Route path="trappSkeet" element={<TrappSkeet />} />
          <Route path="jagarExamen" element={<JagarExamen />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="accountDetails" element={<AccountDetails />} />
          <Route path="member" element={<MemberArea />} />
          
          {/* Admin routes */}
          <Route path="admin" element={
            <ProtectedRoute 
              element={AdminPanel} 
              allowedRoles={['ADMIN']} 
            />
          } />
          <Route path="admin/news" element={
            <ProtectedRoute 
              element={NewsManagement} 
              allowedRoles={['ADMIN']} 
            />
          } />
          <Route path="admin/members" element={
            <ProtectedRoute 
              element={MemberManagement} 
              allowedRoles={['ADMIN']} 
            />
          } />
          
          {/* Admin and Instructor routes */}
          <Route path="admin/shooting-session" element={
            <ProtectedRoute 
              element={ShootingSession} 
              allowedRoles={['ADMIN', 'INSTRUCTOR']} 
            />
          } />
          <Route path="admin/sessions" element={
            <ProtectedRoute 
              element={ShootingSession} 
              allowedRoles={['ADMIN', 'INSTRUCTOR']} 
            />
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;