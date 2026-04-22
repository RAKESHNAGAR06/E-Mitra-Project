// src/admin/ManageServices.jsx
import React, { useState, useContext, useEffect } from 'react';
import { ServiceContext } from '../context/ServiceContext'; // Context Import

const ManageServices = () => {
  // Context se functions le rahe hain
  const { services, addService, updateService, deleteService } = useContext(ServiceContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Edit mode check karne ke liye
  
  // Form Data State
  const emptyForm = () => ({
    name: "",
    title: "",
    price: "",
    category: "Documents",
    icon: "FaFileAlt",
    slug: "",
    aboutContent: "",
    processingTime: "7 - 10 working days",
    stepsText: "",
    documentsText: "",
    formUrl: "",
    nameHi: "",
  });

  const [currentService, setCurrentService] = useState(() => emptyForm());

  const categories = ["Documents", "Bills", "Certificates", "Welfare Schemes","Other Services"];
  const icons = ["FaIdCard", "FaBolt", "FaWater", "FaCreditCard", "FaPassport", "FaHome", "FaFileAlt"];

  // Input Change Handler
  const handleChange = (e) => {
    setCurrentService({ ...currentService, [e.target.name]: e.target.value });
  };

  // --- ADD FUNCTION ---
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentService(emptyForm());
    setIsModalOpen(true);
  };

  // --- EDIT FUNCTION ---
  const openEditModal = (service) => {
    setIsEditing(true);
    setCurrentService({
      ...emptyForm(),
      ...service,
      stepsText: Array.isArray(service.steps) ? service.steps.join("\n") : "",
      documentsText: Array.isArray(service.documents) ? service.documents.join("\n") : "",
    });
    setIsModalOpen(true);
  };

  // --- SUBMIT (ADD or UPDATE) ---
  const handleSubmit = async () => {
    if (!currentService.name || !currentService.title) {
      alert("Please fill Name and Description");
      return;
    }

    const steps = String(currentService.stepsText || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const documents = String(currentService.documentsText || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const { stepsText, documentsText, ...rest } = currentService;
    const payload = { ...rest, steps, documents };

    if (isEditing) {
      // Update Logic
      const res = await updateService(currentService._id, payload);
      if (!res?.success) {
        alert(res?.error || "Update failed (login required)");
        return;
      }
    } else {
      // Add Logic
      const res = await addService(payload);
      if (!res?.success) {
        alert(res?.error || "Add failed (login required)");
        return;
      }
    }
    setIsModalOpen(false);
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this service?")) {
      const res = await deleteService(id);
      if (!res?.success) {
        alert(res?.error || "Delete failed (login required)");
      }
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
          <p className="text-sm text-gray-500">Total Services: {services.length}</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 flex items-center gap-2"
        >
          <span className='text-xl'>+</span> Add New Service
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-sm text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Service Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-gray-800">{service.name}</div>
                      <div className="text-xs text-gray-400 truncate w-48">{service.title}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-bold">{service.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        service.status === 'Active' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {service.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => openEditModal(service)}
                          className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(service._id)}
                          className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">
                    No services found. Click "Add New Service" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transform transition-all scale-95 animate-fade-in h-full overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {isEditing ? '✏️ Edit Service' : '➕ Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            {/* Modal Form */}
            <div className="space-y-5">
              
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Service Name</label>
                <input 
                  name="name"
                  value={currentService.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Aadhar Card"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description (Title)</label>
                <textarea 
                  name="title"
                  value={currentService.title}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Short description about the service"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">URL slug (optional)</label>
                <input
                  name="slug"
                  value={currentService.slug || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. aadhaar-update (auto from name if empty)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Hindi subtitle (optional)</label>
                <input
                  name="nameHi"
                  value={currentService.nameHi || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. आधार कार्ड अपडेट"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">About this service (long text)</label>
                <textarea
                  name="aboutContent"
                  value={currentService.aboutContent || ""}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Shown on the public service detail page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Processing time</label>
                <input
                  name="processingTime"
                  value={currentService.processingTime || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="7 - 10 working days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">How to apply (one step per line)</label>
                <textarea
                  name="stepsText"
                  value={currentService.stepsText || ""}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder={"Visit center...\nSubmit documents..."}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Required documents (one per line)</label>
                <textarea
                  name="documentsText"
                  value={currentService.documentsText || ""}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Download form URL (optional)</label>
                <input
                  name="formUrl"
                  value={currentService.formUrl || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://..."
                />
              </div>

              {/* Price & Category Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                  <input 
                    name="price"
                    value={currentService.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="₹50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <select 
                    name="category"
                    value={currentService.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* Icon Select */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Icon Name</label>
                <select 
                  name="icon"
                  value={currentService.icon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  {icons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>

            </div>

            {/* Modal Footer Buttons */}
            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 font-semibold"
              >
                {isEditing ? 'Update Service' : 'Save Service'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
