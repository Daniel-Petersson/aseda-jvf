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

// Importera andra sidor här

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
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;