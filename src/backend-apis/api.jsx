import axios from "axios";

// ✅ Base URL for your Superadmin APIs
const API_BASE_URL = "http://onduty-backend-env.eba-wmdu9ckm.ap-south-1.elasticbeanstalk.com/superadmin";

/**
 * ==============================
 *  ADMIN API CALLS
 * ==============================
 */

// ✅ 1. Get all admins (includes profile image + mobile)
export const getAllAdmins = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    // Backend returns: { success, count, data }
    return response.data.data; // Extract only the data array
  } catch (error) {
    console.error("❌ Error fetching admins:", error);
    throw error;
  }
};

// ✅ 2. Get single admin (with profile) by email
export const getAdminByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/email/${email}`);
    // Backend returns: { success, data: { admin + profile } }
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching admin by email:", error);
    throw error;
  }
};

// ✅ 3. Create new admin
export const createAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, adminData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    throw error;
  }
};

// ✅ 4. Update admin
export const updateAdmin = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating admin:", error);
    throw error;
  }
};

// ✅ 5. Delete admin
export const deleteAdmin = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting admin:", error);
    throw error;
  }
};
