import React from 'react';
import { FaClock, FaRupeeSign, FaCheckCircle, FaFileAlt, FaClipboardList, FaExclamationTriangle, FaArrowRight, FaArrowLeft, FaUser } from 'react-icons/fa';

const ServiceDetail = () => {
  
  // Static Data
  const serviceData = {
    title: "Aadhaar Card Update",
    description: "Update name, address, mobile number, or biometric details in your Aadhaar card easily.",
    fee: "₹50 per update",
    time: "7 - 10 working days",
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
        
        {/* HERO SECTION - Exact Screenshot Style */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white pt-20 pb-12 px-6 relative min-h-[320px]">
          
          {/* 1. Back Button (Top Left) */}
          <div className="absolute top-6 left-6 md:left-10">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
              <FaArrowLeft className="text-lg" />
              Back
            </button>
          </div>

          {/* 2. Main Content Layout (Icon + Text) */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 mt-4">
            
            {/* Left Side: White Icon Box */}
            <div className="bg-white p-6 rounded-2xl shadow-xl flex-shrink-0">
              {/* Image me User icon dikh raha hai */}
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
              
              {/* Orange Badge */}
              <span className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                Identity Documents
              </span>
            </div>

          </div>
        </div>

        {/* Main Layout: Left Content & Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-6 relative ">
          
          {/* LEFT SIDE: Steps & Documents */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* How to Apply Section */}
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

            {/* Required Documents Section */}
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
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              
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
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processing Time</p>
                  <p className="text-xl font-bold text-gray-800">{serviceData.time}</p>
                </div>
              </div>

              {/* Button */}
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 mb-4">
                Apply Now <FaArrowRight />
              </button>
              <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <FaFileAlt /> Download Form
              </button>

              {/* Important Note Box */}
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <div className="flex gap-2">
                  <FaExclamationTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 text-sm">Important Note</h4>
                    <p className="text-xs text-orange-600 mt-1">
                      Please carry original documents for verification. Xerox copies will be made at the center.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;