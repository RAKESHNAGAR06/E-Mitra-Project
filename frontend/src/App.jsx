import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Home from './Home';
import Services from './Services';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Services" element={<Services />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;