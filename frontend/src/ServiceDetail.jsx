import React from 'react';
import { FaClock, FaRupeeSign, FaCheckCircle, FaFileAlt, FaExclamationTriangle, FaArrowRight, FaArrowLeft, FaUser, FaTag, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const ServiceDetail = () => {
  const navigate = useNavigate();
  // Static Data
  const serviceData = {
    title: "Aadhaar Card Update",
    description: "Update name, address, mobile number, or biometric details in your Aadhaar card easily. We ensure a hassle-free process with expert guidance at every step.",
    fee: "₹50 per update",
    time: "7 - 10 working days",
    category: "Identity Documents",
    steps: [
      "Visit nearest e-Mitra center with original documents.",
      "Submit the filled application form & documents.",
      "Biometric verification will be done at the center.",
      "Receive acknowledgment slip for tracking status."
    ],
    documents: [
      "Original Aadhaar Card",
      "Proof of new detail (POI/POA like Passport, Voter ID)",
      "Passport size photograph",
      "Filled Application Form"
    ]
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        
        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white pt-20 pb-12 px-6 relative min-h-[320px]">
          
          {/* Back Button */}
          <div className="absolute top-15 left-6 md:left-7">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-10" onClick={() => navigate(-1)}>
              <FaArrowLeft className="text-lg" />
              Back
            </button>
          </div>

          {/* Main Content Layout */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 mt-4">
            
            {/* Left Side: White Icon Box */}
            <div className="bg-white p-6 rounded-2xl shadow-xl flex-shrink-0">
              <FaUser className="text-5xl text-blue-700" />
            </div>

            {/* Right Side: Text Content */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Aadhaar Card Update
              </h1>
              <p className="text-blue-200 mt-1 text-base mb-4">
                आधार कार्ड अपडेट
              </p>
              <span className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                {serviceData.category}
              </span>
            </div>

          </div>
        </div>

        {/* Main Layout: Left Content & Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-8 relative">
          
          {/* LEFT SIDE: About, Steps & Documents */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. About This Service Section (New) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                About This Service
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                {serviceData.description}
              </p>
            </div>

            {/* 2. How to Apply Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
                How to Apply
              </h2>
              <ul className="space-y-4">
                {serviceData.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Required Documents Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">2</span>
                Required Documents
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceData.documents.map((doc, index) => (
                  <li key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* RIGHT SIDE: Quick Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Information Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ">
              
              {/* Fee */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <FaRupeeSign className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Fee</p>
                  <p className="text-xl font-bold text-gray-800">{serviceData.fee}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processing Time</p>
                  <p className="text-xl font-bold text-gray-800">{serviceData.time}</p>
                </div>
              </div>

              {/* Category (New) */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <FaTag className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-xl font-bold text-gray-800">{serviceData.category}</p>
                </div>
              </div>

              {/* Important Note Box */}
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mb-6">
                <div className="flex gap-2">
                  <FaExclamationTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 text-sm">Important Note</h4>
                    <p className="text-xs text-orange-600 mt-1">
                      Please carry original documents for verification.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Button */}
            <a href='/contact'><button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 mb-4">
                Apply Now <FaArrowRight />
              </button></a>
              <button className="w-full py-3 bg-gray-200 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <FaFileAlt /> Download Form
              </button>

            {/* Ready to Apply? Card (New) */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-white mb-4">Ready to Apply?</h3>
                
                <div className="space-y-3">
                    {/* Visit Center Button */}
                    <button className="w-full py-3 bg-orange-400 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <FaMapMarkerAlt /> Visit Center
                    </button>

                    {/* Call Now Button */}
                    <button className="w-full py-3 bg-gray-200 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                        <FaPhoneAlt /> Call Now
                    </button>

                    {/* WhatsApp Button */}
                    <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <FaWhatsapp className="text-lg" /> WhatsApp
                    </button>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;