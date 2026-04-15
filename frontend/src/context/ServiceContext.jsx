// src/context/ServiceContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getStoredToken } from "./AuthContext";

export const ServiceContext = createContext();

// Ye tera Backend URL hai (jo terminal pe chal raha hai)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = BASE_URL + "/services";

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. Data Load karna (MongoDB se)
  const fetchServices = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  // Page load hone pe data fetch kare
  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Naya Service Add Karna
  const addService = async (service) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(service),
      });
      const newService = await res.json();
      if (!res.ok) return { success: false, error: newService?.error || "Failed to add service" };
      setServices([...services, newService]); // UI Update
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // 3. Service Update Karna
  const updateService = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data?.error || "Failed to update service" };
      setServices(services.map((s) => (s._id === id ? data : s)));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // 4. Service Delete Karna
  const deleteService = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { success: false, error: data?.error || "Failed to delete service" };
      setServices(services.filter((s) => s._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <ServiceContext.Provider value={{ services, loading, addService, updateService, deleteService }}>
      {children}
    </ServiceContext.Provider>
  );
};
