import axios from "axios";

// ✅ Base URL for your Superadmin APIs
//<<<<<<< HEAD
const API_BASE_URL = "https://api.ondutyapp.in";
//=======
const API_BASE_URL = "http://onduty-backend-env.eba-wmdu9ckm.ap-south-1.elasticbeanstalk.com/superadmin";
//>>>>>>> d90b7cbb7d8bcde385ad7c2a84e98dda73526b7a

/**
 * ==============================
 *  ADMIN API CALLS
 * ==============================
 */

// ✅ 1. Get all admins (includes profile image + mobile)
export const getAllAdmins = async () => {
  try {
<<<<<<< HEAD
    const response = await axios.get(`${API_BASE_URL}/superadmin`);
=======
    const response = await axios.get(`${API_BASE_URL}`);
>>>>>>> d90b7cbb7d8bcde385ad7c2a84e98dda73526b7a
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
<<<<<<< HEAD
    const response = await axios.get(`${API_BASE_URL}/superadmin/email/${email}`);
=======
    const response = await axios.get(`${API_BASE_URL}/email/${email}`);
>>>>>>> d90b7cbb7d8bcde385ad7c2a84e98dda73526b7a
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
<<<<<<< HEAD
    const response = await axios.post(`${API_BASE_URL}/superadmin`, adminData);
=======
    const response = await axios.post(`${API_BASE_URL}`, adminData);
>>>>>>> d90b7cbb7d8bcde385ad7c2a84e98dda73526b7a
    return response.data;
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    throw error;
  }
};

// ✅ 4. Update admin
export const updateAdmin = async (id, updatedData) => {
  try {
<<<<<<< HEAD
    const response = await axios.put(`${API_BASE_URL}/superadmin/${id}`, updatedData);
=======
    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
>>>>>>> d90b7cbb7d8bcde385ad7c2a84e98dda73526b7a
    return response.data;
  } catch (error) {
    console.error("❌ Error updating admin:", error);
    throw error;
  }
};

// ✅ 5. Delete admin
export const deleteAdmin = async (id) => {
  try {
<<<<<<< HEAD
    const response = await axios.delete(`${API_BASE_URL}/superadmin/${id}`);
=======
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
>>>>>>> d90b7cbb7d8bcde385ad7c2a84e98dda73526b7a
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting admin:", error);
    throw error;
  }
};
