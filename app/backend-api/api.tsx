import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// Your PC local IP, reachable by device

export const API_BASE_URL = "http://10.84.38.49:8080";



/* ------------------ SEND OTP ------------------ */
export const sendOtp = async (email: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken"); // optional if user already exists

    const response = await fetch(`${API_BASE_URL}/user/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ attach if available
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("❌ sendOtp error:", error);
    throw new Error("Failed to send OTP");
  }
};



/* ------------------ REGISTER ------------------ */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  otp: string
) => {
  try {
    const token = await AsyncStorage.getItem("authToken"); // ✅ optional saved token

    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ same as login
      },
      body: JSON.stringify({ name, email, password, otp }),
    });

    const data = await response.json();

    // ✅ If registration successful, store token for next requests
    if (data.success && data.token) {
      await AsyncStorage.setItem("authToken", data.token);
    }

    return data;
  } catch (error: any) {
    console.error("❌ registerUser error:", error);
    throw new Error("Failed to register");
  }
};



/* ------------------ LOGIN ------------------- */
export const loginUser = async (email: string, password: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken"); // ✅ optional existing token
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ include if available
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("❌ loginUser error:", error);
    throw new Error("Failed to login");
  }
};



/* ----------------- Forgot Password ---------------- */
export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    console.log("🔵 Forgot Password Response:", data);

    // ✅ Support both resetToken and token just in case
    const token = data.resetToken || data.token;

    if (data.success && token) {
      return { success: true, token };
    }

    return { success: false, message: data.message || "User not found" };
  } catch (error: any) {
    console.error("❌ forgotPassword error:", error);
    throw new Error("Failed to send reset request");
  }
};



/* ----------------- Reset Password ---------------- */
export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("❌ Reset Password API Error:", error);
    throw error;
  }
};



/* ----------------- Fetch all plans ---------------- */
export const getAllPlans = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/plan`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error fetching plans:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch plans");
  }
};



/* ---------------------- Upgrade Plan ---------------------- */
export const upgradePlan = async (plan: string, planType?: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken"); // ✅ corrected key
    if (!token) throw new Error("No token found. Please log in again.");

    const res = await axios.post(
      `${API_BASE_URL}/plan/upgrade-plan`,
      { plan, planType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("❌ Error upgrading plan:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};



/* ---------------------- Profile ---------------------- */
export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/profile/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error fetching profile:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};



/* ✅ Fetch actual profile image (Base64 or Blob)*/

export const getProfileImage = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    // Fetch image as blob
    const res = await axios.get(`${API_BASE_URL}/profile/photo?timestamp=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    // Convert blob → base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(res.data);
    });

    return base64;
  } catch (err: any) {
    console.error("❌ Error fetching profile image:", err.response?.data || err.message);
    return null;
  }
};

export const postProfile = async (formData: FormData) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.post(`${API_BASE_URL}/profile/post`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error posting profile:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};



// 🟢 Log employee action (clock-in, clock-out, client check-in/out)
export const sendDashboardAction = async (payload: {
  type: string;
  workedHours?: number;
  clientName?: string;
  fromLocation?: string;
  toLocation?: string;
  status?: "Active" | "Inactive";
}) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    // ❌ dateString and timeString removed (handled by backend)
    const res = await axios.post(`${API_BASE_URL}/dashboard/action`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Dashboard Action Error:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};



/* ---------------- Helper ---------------- */
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("authToken"); // ✅ fixed
  if (!token) throw new Error("No auth token found");
  return { headers: { Authorization: `Bearer ${token}` } };
};



/* ---------------- VISIT APIs ---------------- */
export const getVisits = async () => {
  const config = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/visit/get`, config);
  return res.data;
};

export const postVisit = async (visitData: any) => {
  const config = await getAuthHeaders();
  const formData = new FormData();

  formData.append("taskName", visitData.taskName);
  formData.append("type", visitData.type);
  formData.append("notes", visitData.notes);
  formData.append("status", visitData.status);
  formData.append("date", visitData.date);

  if (visitData.imageUri) {
    const filename = visitData.imageUri.split("/").pop();
    const type = filename?.split(".").pop();
    formData.append("image", {
      uri: visitData.imageUri,
      type: `image/${type}`,
      name: filename,
    } as any);
  }

  const res = await axios.post(`${API_BASE_URL}/visit/post`, formData, {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};



/* ---------------- UPDATE Visit ---------------- */
export const updateVisit = async (id: string, visitData: any) => {
  const config = await getAuthHeaders();
  const formData = new FormData();

  // Always include text fields
  formData.append("taskName", visitData.taskName);
  formData.append("type", visitData.type);
  formData.append("status", visitData.status);
  formData.append("date", visitData.date);
  formData.append("notes", visitData.notes || "");

  // ✅ Include image only if a new one was picked
  if (visitData.imageUri && visitData.imageUri.startsWith("file")) {
    const filename = visitData.imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename ?? "");
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("image", {
      uri: visitData.imageUri,
      name: filename || "photo.jpg",
      type,
    } as any);
  }

  try {
    const res = await axios.put(`${API_BASE_URL}/visit/put/${id}`, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    console.log("❌ Error updating visit:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteVisit = async (id: string) => {
  const config = await getAuthHeaders();
  const res = await axios.delete(`${API_BASE_URL}/visit/delete/${id}`, config);
  return res.data;
};


export const fetchVisitImageBase64 = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/visit/image/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(res.data);
    });

    return base64;
  } catch (err: any) {
    console.error("❌ Error fetching visit image:", err.response?.data || err.message);
    return null;
  }
};



/* ------------------ POST Report ------------------ */
export const postReport = async (reportData: any) => {
  const formData = new FormData();

  formData.append("clientName", reportData.clientName);
  formData.append("purpose", reportData.purpose);
  formData.append("notes", reportData.notes);

  if (reportData.imageUri && reportData.imageUri.startsWith("file://")) {
    formData.append("image", {
      uri: reportData.imageUri,
      name: "report.jpg",
      type: "image/jpeg",
    } as any);
  }

  const authHeader  = await getAuthHeaders();
  await axios.post(`${API_BASE_URL}/report/post`, formData, {
    headers: { ...authHeader.headers , "Content-Type": "multipart/form-data" },
  });
};

/* ------------------ GET Reports ------------------ */
export const getReports = async () => {
  const authHeader  = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/report/get`,  authHeader );
  const reports = res.data.reports || [];
  const totalReports = res.data.totalReports || reports.length;

  // 🧩 Add totalReports as property but still keep array for compatibility
  reports.totalReports = totalReports;

  return reports;
};

/* ------------------ UPDATE Report ------------------ */
export const updateReport = async (id: string, reportData: any) => {
  const formData = new FormData();

  formData.append("clientName", reportData.clientName);
  formData.append("purpose", reportData.purpose);
  formData.append("notes", reportData.notes);

  if (reportData.imageUri && reportData.imageUri.startsWith("file://")) {
    formData.append("image", {
      uri: reportData.imageUri,
      name: "report.jpg",
      type: "image/jpeg",
    } as any);
  }

  const authHeader  = await getAuthHeaders();
  const res = await axios.put(`${API_BASE_URL}/report/put/${id}`, formData, {
    headers: { ...authHeader.headers , "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/* ------------------ FETCH Image Base64 (for edit) ------------------ */
export const fetchReportImageBase64 = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/report/image/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(res.data);
    });

    return base64;
  } catch (err: any) {
    console.error("❌ Error fetching report image:", err.response?.data || err.message);
    return null;
  }
};


/* ------------------ POST Client ------------------ */
export const addClient = async (clientData: any) => {
  const formData = new FormData();

  formData.append("name", clientData.name);
  formData.append("address", clientData.address);
  formData.append("latitude", String(clientData.latitude));
  formData.append("longitude", String(clientData.longitude));
  formData.append("clientNumber", clientData.clientNumber);

  if (clientData.imageUri && clientData.imageUri.startsWith("file://")) {
    formData.append("image", {
      uri: clientData.imageUri,
      name: "client.jpg",
      type: "image/jpeg",
    } as any);
  }

  const authHeader = await getAuthHeaders();
  await axios.post(`${API_BASE_URL}/client/post`, formData, {
    headers: {
      ...authHeader.headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ------------------ GET Clients ------------------ */
export const getClients = async () => {
  const authHeader = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/client/get`, authHeader);
  const clients = res.data.clients || [];
  const totalClients = res.data.totalClients || clients.length;

  clients.totalClients = totalClients;
  return clients;
};

/* ------------------ UPDATE Client ------------------ */
export const updateClient = async (id: string, clientData: any) => {
  const formData = new FormData();

  formData.append("name", clientData.name);
  formData.append("address", clientData.address);
  formData.append("latitude", String(clientData.latitude));
  formData.append("longitude", String(clientData.longitude));
  formData.append("clientNumber", clientData.clientNumber);

  if (clientData.imageUri && clientData.imageUri.startsWith("file://")) {
    formData.append("image", {
      uri: clientData.imageUri,
      name: "client.jpg",
      type: "image/jpeg",
    } as any);
  }

  const authHeader = await getAuthHeaders();
  const res = await axios.put(`${API_BASE_URL}/client/put/${id}`, formData, {
    headers: {
      ...authHeader.headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* ------------------ FETCH Client Image (Base64) ------------------ */
export const fetchClientImageBase64 = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const res = await axios.get(`${API_BASE_URL}/client/image/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(res.data);
    });

    return base64;
  } catch (err: any) {
    console.error("❌ Error fetching client image:", err.message);
    return null;
  }
};



/* ------------------ POST Live Location ------------------ */
export const postLiveLocation = async (latitude: number, longitude: number) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.post(`${API_BASE_URL}/location/post`,
      { latitude, longitude },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("❌ Error posting live location:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};


























/* ------------------ GET Admin Dashboard ------------------ */
export const getAdminDashboard = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error fetching admin dashboard:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};

/* ✅ Fetch only the photo (used in dashboard.tsx maybe) */
export const fetchEmployeeProfilePhoto = async (email: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/profile/photo/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(res.data);
    });

    return base64;
  } catch (err: any) {
    console.error(`❌ Error fetching photo for ${email}:`, err.response?.data || err.message);
    return null;
  }
};

/* ✅ Fetch profile info + image URL */
export const fetchEmployeeProfileMeta = async (email: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(
      `${API_BASE_URL}/profile/photo/${encodeURIComponent(email)}?meta=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data?.profile || null;
  } catch (err: any) {
    console.error(`❌ Error fetching profile info for ${email}:`, err.response?.data || err.message);
    return null;
  }
};

// ------------------ ADMIN: POST Client ------------------
export const adminAddClient = async (clientData: any) => {
  const formData = new FormData();

  formData.append("name", clientData.name);
  formData.append("address", clientData.address);
  formData.append("latitude", String(clientData.latitude));
  formData.append("longitude", String(clientData.longitude));
  formData.append("clientNumber", clientData.clientNumber);

  if (clientData.imageUri && clientData.imageUri.startsWith("file://")) {
    formData.append("image", {
      uri: clientData.imageUri,
      name: "client.jpg",
      type: "image/jpeg",
    } as any);
  }

  const authHeader = await getAuthHeaders();
  const res = await axios.post(`${API_BASE_URL}/client/post`, formData, {
    headers: {
      ...authHeader.headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ------------------ ADMIN: GET Clients ------------------
export const adminGetClients = async () => {
  const authHeader = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/client/admin`, authHeader);
  const clients = res.data.clients || [];
  const totalClients = res.data.totalClients || clients.length;

  clients.totalClients = totalClients;
  return clients;
};

// ------------------ ADMIN: UPDATE Client ------------------
export const adminUpdateClient = async (id: string, clientData: any) => {
  const formData = new FormData();

  formData.append("name", clientData.name);
  formData.append("address", clientData.address);
  formData.append("latitude", String(clientData.latitude));
  formData.append("longitude", String(clientData.longitude));
  formData.append("clientNumber", clientData.clientNumber);

  if (clientData.imageUri && clientData.imageUri.startsWith("file://")) {
    formData.append("image", {
      uri: clientData.imageUri,
      name: "client.jpg",
      type: "image/jpeg",
    } as any);
  }

  const authHeader = await getAuthHeaders();
  const res = await axios.put(`${API_BASE_URL}/client/put/${id}`, formData, {
    headers: {
      ...authHeader.headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ------------------ ADMIN: DELETE Client ------------------
export const adminDeleteClient = async (id: string) => {
  const authHeader = await getAuthHeaders();
  const res = await axios.delete(`${API_BASE_URL}/client/delete/${id}`, authHeader);
  return res.data;
};




// ------------------ ADMIN: GET Reports ------------------
export const adminGetReports = async () => {
  const authHeader = await getAuthHeaders();
  const res = await axios.get(`${API_BASE_URL}/report/admin`, authHeader);
  const reports = res.data.reports || [];
  const totalReports = res.data.totalReports || reports.length;

  reports.totalReports = totalReports;
  return reports;
};

// ------------------ ADMIN: DELETE Report ------------------
export const adminDeleteReport = async (id: string) => {
  const authHeader = await getAuthHeaders();
  const res = await axios.delete(`${API_BASE_URL}/report/delete/${id}`, authHeader);
  return res.data;
};



/* ------------------ NOTIFICATIONS ------------------ */
export const getNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/notification/get`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error fetching notifications:", err.response?.data || err.message);
    return { success: false, notifications: [] };
  }
};

export const deleteNotification = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.delete(`${API_BASE_URL}/notification/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error deleting notification:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};

export const clearAllNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.delete(`${API_BASE_URL}/notification/clear`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error clearing notifications:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};

/* ---------------- CLIENT APPROVAL (Admin) ---------------- */
export const approveOrDeclineClient = async (
  notificationId: string,
  approved: boolean
) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.put(
      `${API_BASE_URL}/client/approve/${notificationId}`,
      { approved },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("❌ Error approving/declining client:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};


// ==================== ADMIN: EMPLOYEE MANAGEMENT ====================

/* ------------------ ADD Employee ------------------ */
export const adminAddEmployee = async (employeeData: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.post(`${API_BASE_URL}/plan/add-employee`, employeeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error adding employee:", err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

/* ------------------ GET All Employees ------------------ */
export const adminGetEmployees = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/plan/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Optional: normalize structure if backend sends array directly
    const employees = res.data.employees || [];
    const totalEmployees = employees.length;

    employees.totalEmployees = totalEmployees;
    return employees;
  } catch (err: any) {
    console.error("❌ Error fetching employees:", err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

/* ------------------ DELETE Employee ------------------ */
export const adminDeleteEmployee = async (employeeEmail: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.delete(`${API_BASE_URL}/plan/employee/${encodeURIComponent(employeeEmail)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ Error deleting employee:", err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || err.message };
  }
};








/* ============================================================
   🔹 GET — All Employees Live Locations (Admin)
=========================================================== */
export const getAllLiveLocations = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/location/live`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.locations;
  } catch (err: any) {
    console.error("❌ Error fetching all live locations:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};

/* ============================================================
   🔹 GET — Specific Employee Live Location (Admin)
=========================================================== */
export const getEmployeeLiveLocation = async (empEmail: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(`${API_BASE_URL}/location/live/${empEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.employeeLive;
  } catch (err: any) {
    console.error("❌ Error fetching employee live location:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};

/* ============================================================
   🔹 GET — Employee Location History (Admin)
=========================================================== */
export const getEmployeeLocationHistory = async (
  empEmail: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const params = new URLSearchParams({ employeeEmail: empEmail });
    if (startDate && endDate) {
      params.append("startDate", startDate);
      params.append("endDate", endDate);
    }

    const res = await axios.get(`${API_BASE_URL}/location/history?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.history;
  } catch (err: any) {
    console.error("❌ Error fetching location history:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message };
  }
};


/* ============================================================
   🔹 ADMIN: GET Visits (All Employees or Specific Employee)
=========================================================== */
export const adminGetVisits = async (employeeEmail?: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    // Build the correct URL
    const url = employeeEmail
      ? `${API_BASE_URL}/visit/admin?employeeEmail=${employeeEmail}`
      : `${API_BASE_URL}/visit/admin`;

    // Add Authorization header with Bearer token
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Extract data safely
    const visits = res.data.visits || [];
    const totalVisits = res.data.totalVisits || 0;
    const completed = res.data.completed || 0;
    const employees = res.data.employees || [];

    return { visits, totalVisits, completed, employees };
  } catch (err: any) {
    console.error("❌ Error fetching admin visits:", err.response?.data || err.message);
    return { visits: [], totalVisits: 0, completed: 0, employees: [] };
  }
};





// posting location to super admin

export const postAdminAddress = async (address: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken"); // ✅ make sure key matches your login storage

    if (!token) {
      console.warn("⚠️ No token found. Cannot post address.");
      return { success: false, message: "No token found" };
    }

    const response = await axios.post(
      `${API_BASE_URL}/admintrack/`,
      { address },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.data.success) {
      console.log("✅ Address posted successfully:", response.data.track);
      return {
        success: true,
        message: response.data.message,
        track: response.data.track,
      };
    } else {
      console.warn("⚠️ Backend responded with:", response.data.message);
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error: any) {
    console.error("❌ Error posting address:", error.message);
    return {
      success: false,
      message: error.message || "Network error while posting address",
    };
  }
};