import React, { useState } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

function Contact() { 
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    service: '',
    message: ''
  });

  const services = [
    "PAN Card", "Aadhaar Update", "Birth Certificate",
    "Income Certificate", "Electricity Bill", "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Message Sent Successfully!");
  };
  
  const address = "Main Market, District Center, Rajasthan - 302001, India";
  const mapCoords = "24.4339432,75.9863679";
  const mapSrc = `https://www.google.com/maps?q=${mapCoords}&output=embed`;
  const directionsLink = `https://www.google.com/maps?q=${mapCoords}`;

  return (
    <div className="w-full font-sans bg-gray-50">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-blue-200 mt-1 text-sm md:text-base">
            संपर्क करें - We're here to help you
          </p>
        </div>
      </div>        
        
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          
        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 bg-white shadow-xl p-4 sm:p-6 md:p-10 rounded-2xl border border-gray-100 mb-10 md:mb-12">
          
          {/* LEFT SIDE - Form */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Send Us a Message</h2>
            <p className="text-gray-600 mt-1 text-xs md:text-sm mb-4">
              हमें संदेश भेजें - Fill out the form and we'll contact you soon
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Full Name / नाम <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Mobile Number / मोबाइल नंबर <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Service Required / सेवा आवश्यक <span className="text-red-500">*</span>
                </label>
                <select 
                  name="service" value={formData.service} onChange={handleChange}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700"
                  required
                >
                  <option value="" disabled>-- Select Service --</option>
                  {services.map((s, i) => ( <option key={i} value={s}>{s}</option> ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Message / संदेश <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea 
                  name="message" value={formData.message} onChange={handleChange} rows="4"
                  placeholder="Write your message here..."
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full py-2.5 md:py-3 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> Submit Request
              </button>
            </form>
          </div>

          {/* RIGHT SIDE - All Content in One Column */}
          <div className="flex flex-col justify-center gap-5 w-full">
              
              {/* 1. Quick Contact */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-5 md:p-6 rounded-2xl shadow-md w-full">
                <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Quick Contact</h3>
                <div className="space-y-3">
                    <button className="w-full py-2.5 md:py-3 text-sm bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <FaMapMarkerAlt /> Visit Center
                    </button>
                    <button className="w-full py-2.5 md:py-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                        <FaPhoneAlt /> Call Now
                    </button>
                    <button className="w-full py-2.5 md:py-3 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <FaWhatsapp className="text-lg" /> WhatsApp
                    </button>
                </div>
              </div>

              {/* 2. Contact Information */}
              <div className='bg-white rounded-xl border border-gray-100 p-5 md:p-6 shadow-sm w-full'>
                  <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-5 uppercase tracking-wide border-b pb-3">Contact Information</h3>
                  <div className="space-y-4 text-xs md:text-sm">
                      <div className="flex items-start gap-3">
                          <FaMapMarkerAlt className="text-red-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                          <div>
                              <p className="font-semibold text-gray-800">Address</p>
                              <p className="text-gray-600 leading-relaxed">{address}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <FaPhoneAlt className="text-blue-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                          <div>
                              <p className="font-semibold text-gray-800">Phone</p>
                              <p className="text-gray-600">+91 98765 43210</p>
                              <p className="text-gray-600">+91 141 234 5678</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <FaEnvelope className="text-purple-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                          <div>
                              <p className="font-semibold text-gray-800">Email</p>
                              <p className="text-gray-600">info@emitra.gov.in</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <FaClock className="text-orange-500 text-base md:text-xl mt-0.5 flex-shrink-0" />
                          <div>
                              <p className="font-semibold text-gray-800">Working Hours</p>
                              <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                              <p className="text-red-500 text-xs font-medium mt-0.5">Sunday: Closed</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 3. Walk-in Welcome */}
              <div className="p-5 bg-indigo-100 rounded-xl border border-indigo-100 w-full">
                  <p className="text-indigo-800 font-bold text-sm md:text-base">Walk - in Welcome!</p>
                  <p className="text-indigo-600 text-xs md:text-sm mt-1">
                      Feel free to visit us directly during working hours.
                  </p>
              </div>

          </div>
        </div>

        {/* Find Us on Map Section */}
        <section className="bg-white font-sans">
            <div className="w-full">
                <div className="mb-4 md:mb-6 px-2 md:px-4 py-2 md:py-4">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-800">Find Us on Map</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">हमारा पता</p>
                </div>

                <div className="relative shadow-lg overflow-hidden border border-gray-200 h-[300px] md:h-[450px]">
                    <iframe
                        src={mapSrc} width="100%" height="100%"
                        style={{ border: 0 }} allowFullScreen="" loading="lazy"
                        className="absolute inset-0"
                    ></iframe>

                    {/* Floating Card - Mobile me column, Tablet/Laptop me row */}
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-10 md:right-10 bg-white rounded-xl shadow-2xl p-4 md:p-5 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 border border-gray-100">
                        
                        <div className="flex items-center gap-3 text-center sm:text-left">
                            <FaMapMarkerAlt className="text-orange-500 text-xl md:text-2xl flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-800 text-xs md:text-sm">Our Location</h4>
                                <p className="text-gray-500 text-[10px] md:text-xs">{address}</p>
                            </div>
                        </div>

                        <a 
                            href={directionsLink} target="_blank" rel="noopener noreferrer"
                            className="px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-md transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;