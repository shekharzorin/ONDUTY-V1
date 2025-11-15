// src/api/api.jsx
import axios from "axios";

// ✅ Replace with your actual backend URL
const API_BASE_URL = "http://localhost:8080/superadmin";

// ✅ Get all admins
export const getAllAdmins = async () => {
 try {
    const response = await axios.get(`${API_BASE_URL}/email/${email}`);
    return response.data.data; // { success, data: { admin + profile + image } }
  } catch (error) {
    console.error("❌ Error fetching admin by email:", error);
    throw error;
  }
};
