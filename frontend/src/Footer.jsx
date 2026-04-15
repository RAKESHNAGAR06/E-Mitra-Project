import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  
  // Quick Links Data
  const quickLinks = [
    { name: 'Home', hindi: 'होम', path: '/' },
    { name: 'Services', hindi: 'सेवाएं', path: '/Services' },
    { name: 'About Us', hindi: 'बारे में', path: '/About' },
    { name: 'Contact', hindi: 'संपर्क', path: '/#' },
  ];

  // Popular Services Data
  const popularServices = [
    "PAN Card Apply",
    "Aadhaar Update",
    "Birth Certificate",
    "Income Certificate",
    "Electricity Bill Payment"
  ];

  return (
    // Background Color: Dark Navy Blue (Slate 900) - Exactly matching screenshot
    <footer className="bg-[#1A3A77] text-white pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          
          {/* Column 1: Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              {/* Logo Icon - Orange Box */}
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">e</span>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">e-Mitra</h3>
                <p className="text-xs text-gray-400">Digital Service Center</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for all government and non-government services. We are committed to providing efficient, reliable, and accessible services to every citizen.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm flex items-center gap-2"
                  >
                    <span className="text-xs text-gray-600">›</span>
                    {link.name} <span className="text-xs text-gray-500">({link.hindi})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Services */}
          <div>
            <h4 className="text-lg font-bold mb-5 text-white">Popular Services</h4>
            <ul className="space-y-3">
              {popularServices.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm flex items-center gap-2"
                  >
                    <span className="text-xs text-gray-600">›</span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-lg font-bold mb-5 text-white">Contact Us</h4>
            <ul className="space-y-4">
              {/* Address */}
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                <span>123, Main Road, Near Bus Stand, City Name, State - 123456</span>
              </li>
              {/* Phone */}
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FaPhoneAlt className="text-orange-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              {/* Email */}
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FaEnvelope className="text-orange-500 flex-shrink-0" />
                <span>support@emitra.com</span>
              </li>
              {/* Working Hours */}
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FaClock className="text-orange-500 flex-shrink-0" />
                <span>Mon - Sat: 09:00 AM - 06:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar - Copyright & Social Icons */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright Text */}
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 e-Mitra Portal. All Rights Reserved.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 bg-transparent border border-gray-600 hover:bg-orange-500 hover:border-orange-500 rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="#" className="w-9 h-9 bg-transparent border border-gray-600 hover:bg-orange-500 hover:border-orange-500 rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white">
              <FaTwitter className="text-sm" />
            </a>
            <a href="#" className="w-9 h-9 bg-transparent border border-gray-600 hover:bg-orange-500 hover:border-orange-500 rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white">
              <FaInstagram className="text-sm" />
            </a>
            <a href="#" className="w-9 h-9 bg-transparent border border-gray-600 hover:bg-orange-500 hover:border-orange-500 rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white">
              <FaYoutube className="text-sm" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;