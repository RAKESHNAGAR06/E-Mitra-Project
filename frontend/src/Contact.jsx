import React, { useState } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaClock, FaPaperPlane  } from 'react-icons/fa';

function Contact() { 
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    service: '',
    message: ''
  });

  // Services List for Dropdown
  const services = [
    "PAN Card",
    "Aadhaar Update",
    "Birth Certificate",
    "Income Certificate",
    "Electricity Bill",
    "Other"
  ];

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Message Sent Successfully!");
    // Yahan tu API call kar sakta hai
  };

  return (
<div className="w-full">
 {/* HERO SECTION - Exact Screenshot Style */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-6">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-blue-200 mt-1 text-4">
          संपर्क करें - We're here to help you
          </p>
        </div>
      </div>        
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Contact Us</h1>
          <p className="text-gray-500 mt-2">We are here to help you.</p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white  shadow-xl p-6 md:p-10 border border-gray-100 w-full">
          
          {/* LEFT SIDE - Form */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Mobile Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Service Select */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Select Service</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                  required
                >
                  <option value="" disabled>-- Choose a Service --</option>
                  {services.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Your Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit Button - BLUE COLOR AS PER SCREENSHOT */}
              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> Submit Request
              </button>
            </form>
          </div>

          {/* RIGHT SIDE - Exact Layout */}
          <div className="flex flex-col justify-center">
            
            {/* 1. Quick Contact Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">Quick Contact</h3>
              
              <div className="space-y-3">
                {/* Phone - Orange Box */}
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <FaPhoneAlt className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call Us</p>
                    <p className="font-bold text-gray-800 text-lg">+91 98765 43210</p>
                  </div>
                </div>

                {/* WhatsApp - Green Box */}
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <FaWhatsapp className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Chat Support</p>
                    <p className="font-bold text-gray-800">Chat with us</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Contact Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">Contact Information</h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                  <span>123, Main Market, Near Bus Stand, City, State - 123456</span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-blue-500 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-purple-500 flex-shrink-0" />
                  <span>info@emitra.gov.in</span>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-3">
                  <FaClock className="text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Mon - Sat: 9:00 AM - 6:00 PM</p>
                    <p className="text-xs text-red-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Walk-in Welcome Box */}
            <div className="mt-4 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-indigo-800 font-bold text-base">Walk - in Welcome!</p>
              <p className="text-indigo-600 text-sm mt-1">
                Feel free to visit us directly during working hours. Most services require no prior appointment.
              </p>
            </div>

          </div>
        </div>
 </div>
  );
};

export default Contact;