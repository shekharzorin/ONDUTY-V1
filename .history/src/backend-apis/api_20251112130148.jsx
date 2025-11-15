// src/api/api.jsx
import axios from "axios";

// ✅ Replace with your actual backend URL
const API_BASE_URL = "http://localhost:8080/superadmin";

// ✅ Get all admins
export const getAllAdmins = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.data; // since backend returns { success, count, data }
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};
