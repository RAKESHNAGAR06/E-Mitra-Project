import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Home from './Home';
import Services from './Services';
import About from './About';
import Contact from './Contact'
import ServiceDetail from './ServiceDetail';
import UserDashboard from './UserDashboard';
import Footer from './Footer';
// Admin Imports
import AdminLayout from './Admin/AdminLayout';
import Dashboard from './Admin/Deshboard';
import ManageServices from './Admin/ManageServices';
import Settings from './Admin/Settings';
import Messages from './Admin/Messages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* /admin path */}
          <Route path="services" element={<ManageServices />} /> {/* /admin/services path */}
          <Route path="messages" element={<Messages />} /> {/* /admin/messages path */}
          <Route path="settings" element={<Settings />} /> {/* /admin/settings path */}
          {/* Add more admin routes here */}
        </Route>

        {/* --- PUBLIC ROUTES --- */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Services" element={<Services />} />
              <Route path="/About" element={<About />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/service/:slug" element={<ServiceDetail />} />
            </Routes>
            <Footer />
          </>
        } />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;