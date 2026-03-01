import axios from "axios";
import { storage } from "../main/services/storage";

export const API_BASE_URL = "http://localhost:5000";

/* ------------------------------------------------------------------
   1) AXIOS INSTANCE WITH ACCESS TOKEN ATTACH
------------------------------------------------------------------ */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important for refresh token cookie
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isLoggingOut = false;

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (isLoggingOut && error.response?.status === 401) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

/* ------------------------------------------------------------------
   2) REFRESH ACCESS TOKEN
------------------------------------------------------------------ */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (isLoggingOut) return null;
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/refresh-token`,
      {},
      { withCredentials: true },
    );
    if (res.data.accessToken) {
      storage.set("accessToken", res.data.accessToken);
      return res.data.accessToken;
    }
    return null;
  } catch (err: any) {
    console.error("🔄 Refresh token error:", err.response?.data || err.message);
    return null;
  }
};

/* ------------------------------------------------------------------
   3) LOGIN USER
------------------------------------------------------------------ */
export const loginUser = async (email: string, password: string) => {
  try {
    storage.remove("accessToken");
    storage.remove("userRole");
    storage.remove("userId");
    storage.clear();

    const res = await axios.post(
      `${API_BASE_URL}/user/login`,
      {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      },
      { withCredentials: true },
    );
    if (res.data.accessToken) {
      storage.set("accessToken", res.data.accessToken);
    }
    if (res.data.user?.role) {
      storage.set("userRole", res.data.user.role);
    }
    if (res.data.user?.id) {
      storage.set("userId", res.data.user.id);
    }
    return res.data;
  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
};

/* ------------------------------------------------------------------
   4) SEND OTP
------------------------------------------------------------------ */
export const sendOtp = async (email: string) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/user/send-otp`, {
      email: email.trim().toLowerCase(),
    });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to send OTP",
    };
  }
};

/* ------------------------------------------------------------------
   5) REGISTER USER
------------------------------------------------------------------ */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  otp: string,
) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/user/register`, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      otp: otp.trim(),
    });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed",
    };
  }
};

/* ------------------------------------------------------------------
   6) FORGOT PASSWORD
------------------------------------------------------------------ */
export const forgotPassword = async (email: string) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/user/forgot-password`, {
      email,
    });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to send reset request",
    };
  }
};

/* ------------------------------------------------------------------
   7) RESET PASSWORD
------------------------------------------------------------------ */
export const resetPassword = async (token: string, password: string) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/user/reset-password`, {
      token,
      password,
    });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to reset password",
    };
  }
};

/* ------------------------------------------------------------------
   8) LOGOUT USER
------------------------------------------------------------------ */
export const logoutUser = async (): Promise<boolean> => {
  try {
    isLoggingOut = true;
    const res = await api.post("/user/logout", {}, { withCredentials: true });
    if (res.data?.success) {
      storage.remove("accessToken");
      storage.remove("userRole");
      storage.remove("userId");
      storage.clear();
      return true;
    }
    console.warn("Logout failed:", res.data?.message);
    return false;
  } catch (err: any) {
    console.warn("Backend logout error:", err.response?.data || err.message);
    return false;
  } finally {
    isLoggingOut = false;
  }
};

/* ------------------------------------------------------------------
   GET ALL PLANS (Handles token + auto-refresh)
------------------------------------------------------------------ */
export const getAllPlans = async () => {
  try {
    const res = await api.get("/plan");
    return res.data?.plans || [];
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.get("/plan");
      return retry.data?.plans || [];
    }
    throw new Error(err.response?.data?.message || "Failed to fetch plans");
  }
};

/* ------------------------------------------------------------------
   UPGRADE PLAN (Auto token attach + refresh)
------------------------------------------------------------------ */
export const upgradePlan = async (plan: string, planType?: string) => {
  try {
    const res = await api.post("/plan/upgrade-plan", { plan, planType });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.post("/plan/upgrade-plan", { plan, planType });
      return retry.data;
    }
    throw new Error(err.response?.data?.message || "Upgrade failed");
  }
};

/* ------------------------------------------------------------------
   GET PROFILE
------------------------------------------------------------------ */
export const getProfile = async () => {
  try {
    await refreshAccessToken();
    const res = await api.get("/profile/get");
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to load profile");
  }
};

/* ------------------------------------------------------------------
   GET PROFILE IMAGE
------------------------------------------------------------------ */
export const getProfileImage = async () => {
  try {
    await refreshAccessToken();
    const res = await api.get(`/profile/photo?timestamp=${Date.now()}`, {
      responseType: "blob",
    });
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(res.data);
    });
  } catch (error) {
    return null;
  }
};

/* ----------------------------------------------------------------
   UPDATE PROFILE 
----------------------------------------------------------------- */
export const postProfile = async (formData: FormData) => {
  try {
    await refreshAccessToken();
    const res = await api.post("/profile/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile",
    );
  }
};

/* -------------------------------------------------
   GET EMPLOYEE PROFILE IMAGE (Next.js)
------------------------------------------------- */
export const fetchEmployeeProfilePhoto = async (email: string) => {
  try {
    const token = storage.get("accessToken");
    const res = await api.get(`/profile/photo/${email}`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const base64String = Buffer.from(res.data, "binary").toString("base64");
    const contentType = res.headers["content-type"] || "image/jpeg";
    return `data:${contentType};base64,${base64String}`;
  } catch (err: any) {
    console.error("❌ Fetch Employee Photo (Next.js) Error:", err?.message);
    return null;
  }
};

/* -------------------------------------------------
   GET EMPLOYEE PROFILE META (Next.js)
------------------------------------------------- */
export const fetchEmployeeProfileMeta = async (email: string) => {
  try {
    await refreshAccessToken();

    const res = await api.get(`/profile/photo/${email}?meta=true`);
    return res.data; // { mobile, name, email, ... }
  } catch (err: any) {
    console.error(
      "❌ Fetch Employee Meta Error:",
      err.response?.data || err.message,
    );
    return null;
  }
};

/* -------------------------------------------------
   GET ADMIN DASHBOARD (Next.js)
------------------------------------------------- */
export const getAdminDashboard = async () => {
  try {
    const res = await api.get("/dashboard/admin");
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Admin Dashboard Fetch Error:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
   GET NOTIFICATIONS (Next.js)
------------------------------------------------- */
export const getNotifications = async () => {
  try {
    const res = await api.get("/notification/get");
    return res.data; // { success, notifications }
  } catch (err: any) {
    console.log(
      "❌ Error fetching notifications:",
      err.response?.data || err.message,
    );
    return { success: false, notifications: [] };
  }
};

/* -------------------------------------------------
   DELETE NOTIFICATION
------------------------------------------------- */
export const deleteNotification = async (id: string) => {
  try {
    const res = await api.delete(`/notification/${id}`);
    return res.data;
  } catch (err: any) {
    console.log(
      "❌ Error deleting notification:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
   CLEAR ALL NOTIFICATIONS
------------------------------------------------- */
export const clearAllNotifications = async () => {
  try {
    const res = await api.delete("/notification/clear");
    return res.data;
  } catch (err: any) {
    console.log(
      "❌ Error clearing notifications:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
   APPROVE / DECLINE CLIENT
------------------------------------------------- */
export const approveOrDeclineClient = async (
  notificationId: string,
  approved: boolean,
) => {
  try {
    const res = await api.put(`/client/approve/${notificationId}`, {
      approved,
    });
    return res.data;
  } catch (err: any) {
    console.log("❌ Approve/Decline Error:", err.response?.data || err.message);
    return null;
  }
};

/* ------------------------------------------------------------------
   GET ALL ADMIN REPORTS
------------------------------------------------------------------ */
export const getAdminReports = async (date?: string) => {
  try {
    await refreshAccessToken();
    const query = date ? `?date=${date}` : "";
    const res = await api.get(`/report/admin${query}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.get(
        `/report/admin${date ? `?date=${date}` : ""}`,
      );
      return retry.data;
    }
    throw new Error(err.response?.data?.message || "Failed to fetch reports");
  }
};

/* ------------------------------------------------------------------
   GET REPORT IMAGE (Blob → Base64)
------------------------------------------------------------------ */
export const getReportImage = async (id: string) => {
  try {
    await refreshAccessToken();
    const res = await api.get(`/report/image/${id}`, {
      responseType: "arraybuffer",
    });
    const base64String = Buffer.from(res.data, "binary").toString("base64");
    const contentType = res.headers["content-type"] || "image/jpeg";
    return `data:${contentType};base64,${base64String}`;
  } catch (err: any) {
    console.error("❌ Error fetching report image:", err.message);
    return null;
  }
};

/* ------------------------------------------------------------------
   DELETE REPORT
------------------------------------------------------------------ */
export const deleteReport = async (id: string) => {
  try {
    await refreshAccessToken();
    const res = await api.delete(`/report/delete/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.delete(`/report/delete/${id}`);
      return retry.data;
    }
    throw new Error(err.response?.data?.message || "Failed to delete report");
  }
};

/* ------------------------------------------------------------------
   ADD CLIENT (POST)
------------------------------------------------------------------ */
export const addClient = async (formData: FormData) => {
  try {
    await refreshAccessToken();
    const res = await api.post("/client/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.post("/client/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return retry.data;
    }
    throw new Error(err.response?.data?.message || "Failed to add client");
  }
};

/* ------------------------------------------------------------------
   UPDATE CLIENT
------------------------------------------------------------------ */
export const updateClient = async (id: string, formData: FormData) => {
  try {
    await refreshAccessToken();
    const res = await api.put(`/client/put/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.put(`/client/put/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return retry.data;
    }
    throw new Error(err.response?.data?.message || "Failed to update client");
  }
};

/* ------------------------------------------------------------------
   GET ALL ADMIN CLIENTS
------------------------------------------------------------------ */
export const getAdminClients = async () => {
  try {
    await refreshAccessToken();
    const res = await api.get("/client/admin");
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.get("/client/admin");
      return retry.data;
    }
    throw new Error(err.response?.data?.message || "Failed to fetch clients");
  }
};

/* ------------------------------------------------------------------
   DELETE CLIENT
------------------------------------------------------------------ */
export const deleteClient = async (id: string) => {
  try {
    await refreshAccessToken();
    const res = await api.delete(`/client/delete/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.delete(`/client/delete/${id}`);
      return retry.data;
    }
    throw new Error(err.response?.data?.message || "Failed to delete client");
  }
};

/* ------------------------------------------------------------------
   GET CLIENT IMAGE (Blob → Base64)
------------------------------------------------------------------ */
export const getClientImage = async (id: string) => {
  try {
    await refreshAccessToken();
    const res = await api.get(`/client/image/${id}`, {
      responseType: "arraybuffer",
    });
    const base64String = Buffer.from(res.data, "binary").toString("base64");
    const contentType = res.headers["content-type"] || "image/jpeg";
    return `data:${contentType};base64,${base64String}`;
  } catch (err: any) {
    console.error("❌ Error fetching client image:", err.message);
    return null;
  }
};

/* ------------------------------------------------------------------
   GET ALL ADMIN EMPLOYEES
------------------------------------------------------------------ */
export const adminGetEmployees = async () => {
  try {
    await refreshAccessToken();
    const res = await api.get("/plan/employees");
    const employees = res.data?.employees || [];
    return { success: true, employees, totalEmployees: employees.length };
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.get("/plan/employees");
      const employees = retry.data?.employees || [];
      return { success: true, employees, totalEmployees: employees.length };
    }
    throw new Error(err.response?.data?.message || "Failed to fetch employees");
  }
};

/* ------------------------------------------------------------------
   GET ALL LIVE LOCATIONS
------------------------------------------------------------------ */
export const getAllLiveLocations = async () => {
  try {
    await refreshAccessToken();
    const res = await api.get("/location/live");
    return res.data?.locations || [];
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.get("/location/live");
      return retry.data?.locations || [];
    }
    throw new Error(
      err.response?.data?.message || "Failed to fetch live locations",
    );
  }
};

/* ------------------------------------------------------------------
   ADD EMPLOYEE (ADMIN)
------------------------------------------------------------------ */
export const adminAddEmployee = async (employeeData: any) => {
  try {
    await refreshAccessToken();
    const res = await api.post("/plan/add-employee", employeeData);
    return { success: true, data: res.data };
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const retry = await api.post("/plan/add-employee", employeeData);
      return { success: true, data: retry.data };
    }
    console.error(
      "❌ Error adding employee:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message: err.response?.data?.message || "Failed to add employee",
    };
  }
};

/* ------------------------------------------------------------------
   DELETE EMPLOYEE (ADMIN)
------------------------------------------------------------------ */
export const adminDeleteEmployee = async (employeeEmail: string) => {
  try {
    await refreshAccessToken();
    const encodedEmail = encodeURIComponent(employeeEmail);
    const res = await api.delete(`/plan/employee/${encodedEmail}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Please login again");
      const encodedEmail = encodeURIComponent(employeeEmail);
      const retry = await api.delete(`/plan/employee/${encodedEmail}`);
      return retry.data;
    }
    console.error(
      "❌ Error deleting employee:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete employee",
    };
  }
};

/* ------------------------------------------------------------------
  ADMIN GET LIVE LOCATION OF EMPLOYEE
------------------------------------------------------------------ */
export const getEmployeeLiveLocation = async (empEmail: string) => {
  const res = await api.get(`/location/live/${empEmail}`);
  return res.data.employeeLive;
};

/* ------------------------------------------------------------------
   ADMIN GET LOCATION HISTORY OF EMPLOYEE
------------------------------------------------------------------ */
export const getEmployeeLocationHistory = async (empEmail: string) => {
  const res = await api.get("/location/history", {
    params: { employeeEmail: empEmail },
  });
  return res.data.history;
};

/* -------------------------------------------------
   GET VISITS (ADMIN)
------------------------------------------------- */
export const adminGetVisits = async (employeeEmail?: string) => {
  try {
    const res = await api.get("/visit/admin", {
      params: employeeEmail ? { employeeEmail } : {},
    });
    return {
      success: true,
      visits: res.data.visits || [],
      totalVisits: res.data.totalVisits || 0,
      completed: res.data.completed || 0,
      employees: res.data.employees || [],
    };
  } catch (err: any) {
    console.error(
      "❌ Error fetching admin visits:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      visits: [],
      totalVisits: 0,
      completed: 0,
      employees: [],
    };
  }
};

/* -------------------------------------------------
   GET VISIT IMAGE (Base64) - Next.js
------------------------------------------------- */
export const getVisitImage = async (id: string) => {
  try {
    const res = await api.get(`/visit/image/${id}`, {
      responseType: "arraybuffer",
    });
    const base64String = Buffer.from(res.data).toString("base64");
    const contentType = res.headers["content-type"] || "image/jpeg";
    return `data:${contentType};base64,${base64String}`;
  } catch (err: any) {
    console.error(
      "❌ Error fetching visit image:",
      err.response?.data || err.message,
    );
    return null;
  }
};

/* -------------------------------------------------
   POST ADMIN LOCATION TO SUPER ADMIN (Next.js)
------------------------------------------------- */
export const postAdminAddress = async (address: string) => {
  try {
    const res = await api.post("/admintrack", { address });
    return {
      success: true,
      message: res.data?.message || "Address updated successfully",
      track: res.data?.track,
    };
  } catch (err: any) {
    console.error(
      "❌ Error posting admin address:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Failed to update address",
    };
  }
};

/* -------------------------------------------------
   POST ADMIN STATUS TO SUPER ADMIN (Next.js)
------------------------------------------------- */
export const postUserStatus = async (status: "active" | "inactive") => {
  try {
    const res = await api.post("/admintrack/status", { status });
    return {
      success: true,
      message: res.data?.message || "Status updated successfully",
      track: res.data?.track,
    };
  } catch (err: any) {
    console.error(
      "❌ Error posting user status:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message:
        err.response?.data?.message || err.message || "Failed to update status",
    };
  }
};

/* -------------------------------------------------
   GET MAP CONFIG (WEB - Next.js)
------------------------------------------------- */
export const getMapConfig = async () => {
  try {
    const res = await api.get("/mapapi/map-config");

    return {
      success: res.data?.success || false,
      mapEnabled: res.data?.config?.mapEnabled ?? false,
      webMapKey: res.data?.config?.webMapKey ?? null,
    };
  } catch (err: any) {
    console.error(
      "❌ Error fetching map config:",
      err.response?.data || err.message,
    );

    return {
      success: false,
      mapEnabled: false,
      webMapKey: null,
    };
  }
};
