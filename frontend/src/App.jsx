import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Home from './Home';
import Services from './Services';

// Admin Imports
import AdminLayout from './Admin/AdminLayout';
import Dashboard from './Admin/Deshboard';
import ManageServices from './Admin/ManageServices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* /admin path */}
          <Route path="services" element={<ManageServices />} /> {/* /admin/services path */}
          {/* Add more admin routes here */}
        </Route>

        {/* --- PUBLIC ROUTES --- */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Services" element={<Services />} />
            </Routes>
          </>
        } />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;