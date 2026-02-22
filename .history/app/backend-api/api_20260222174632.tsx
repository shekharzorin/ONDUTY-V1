// api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

export const API_BASE_URL = "http://localhost:5000";

/* -------------------------------------------------
   AXIOS INSTANCE
-------------------------------------------------- */
export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const refreshApi = axios.create({
  baseURL: API_BASE_URL,
});

/* -------------------------------------------------
   REQUEST → Add Access Token
-------------------------------------------------- */
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------------------------------------------------
   RESPONSE → Auto Refresh Token
-------------------------------------------------- */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        processQueue(null, newToken);
        isRefreshing = false;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
      processQueue(error, null);
      isRefreshing = false;
      await AsyncStorage.clear();
    }
    return Promise.reject(error);
  },
);

/* -------------------------------------------------
   REFRESH ACCESS TOKEN
-------------------------------------------------- */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    const res = await refreshApi.post("/user/refresh-token", {
      refreshToken,
    });
    if (res.data.success && res.data.accessToken) {
      await AsyncStorage.setItem("accessToken", res.data.accessToken);
      return res.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
};

/* -------------------------------------------------
   VALIDATE TOKEN
-------------------------------------------------- */
export const validateToken = async (): Promise<boolean> => {
  try {
    const res = await api.get("/user/validate");
    return res.data.valid;
  } catch (error) {
    const err = error as AxiosError<any>;
    console.log("Token validation error:", err.response?.data || err.message);
    return false;
  }
};

/* -------------------------------------------------
   SEND OTP
-------------------------------------------------- */
export const sendOtp = async (email: string) => {
  const res = await axios.post(`${API_BASE_URL}/user/send-otp`, { email });
  return res.data;
};

/* -------------------------------------------------
   REGISTER
-------------------------------------------------- */
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
    console.log("Register API Error:", err.response?.data || err);
    return err.response?.data || { success: false, message: "Server error" };
  }
};

/* -------------------------------------------------
   LOGIN
-------------------------------------------------- */
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/user/login", {
    email: email.trim().toLowerCase(),
    password: password.trim(),
  });
  if (res.data.success) {
    const { accessToken, refreshToken, user } = res.data;
    if (!accessToken || !refreshToken) {
      throw new Error("Missing tokens from backend");
    }
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }
  return res.data;
};

/* -------------------------------------------------
   FORGOT PASSWORD
-------------------------------------------------- */
export const forgotPassword = async (email: string) => {
  const res = await axios.post(`${API_BASE_URL}/user/forgot-password`, {
    email,
  });
  return res.data; // res.data.token now exists for mobile
};

/* -------------------------------------------------
   RESET PASSWORD
-------------------------------------------------- */
export const resetPassword = async (token: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/user/reset-password`, {
    token,
    password,
  });
  return res.data;
};

/* -------------------------------------------------
   LOGOUT
-------------------------------------------------- */
export const logoutUser = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/user/logout`,
      {},
      { withCredentials: true },
    );
  } catch (err) {
    console.warn("Backend logout failed:", err);
  }
  await AsyncStorage.clear();
  return true;
};

/* -------------------------------------------------
   PROFILE DATA
-------------------------------------------------- */
export const getProfile = async () => {
  try {
    const res = await api.get("/profile/get");
    return res.data;
  } catch (err) {
    console.log("Get Profile Error:", err);
    throw err;
  }
};

/* -------------------------------------------------
   GET PROFILE IMAGE
-------------------------------------------------- */
export const getProfileImage = async () => {
  try {
    const res = await api.get(`/profile/photo?timestamp=${Date.now()}`, {
      responseType: "blob",
    });
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(res.data);
    });
    return base64;
  } catch (err: any) {
    console.log("❌ Error fetching profile image:", err?.message);
    return null;
  }
};

/* -------------------------------------------------
  POST PROFILE
-------------------------------------------------- */
export const postProfile = async (email: string, formData: FormData) => {
  try {
    const res = await api.post("/profile/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.log("Post Profile Error:", err);
    throw err;
  }
};

/* -------------------------------------------------
  GET PLANS
-------------------------------------------------- */
export const getAllPlans = async () => {
  try {
    const res = await api.get("/plan");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error fetching plans:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch plans");
  }
};

/* -------------------------------------------------
  UPGRADE PLAN
-------------------------------------------------- */
export const upgradePlan = async (plan: string, planType?: string) => {
  try {
    const res = await api.post("/plan/upgrade-plan", {
      plan,
      planType,
    });
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error upgrading plan:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

//-----------------------------------> employee <----------------------------//

/* -------------------------------------------------
 POST Dashboard Action 
 ------------------------------------------------ */
export const sendDashboardAction = async (payload: {
  type: string;
  workedHours?: number;
  clientName?: string;
  fromLocation?: string;
  toLocation?: string;
  status?: "Active" | "Inactive";
}) => {
  try {
    const res = await api.post("/dashboard/action", payload);
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Dashboard Action Error:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
 POST LIVELOCATION 
 ------------------------------------------------ */
export const postLiveLocation = async (latitude: number, longitude: number) => {
  try {
    const res = await api.post("/location/post", {
      latitude,
      longitude,
    });
    return res.data;
  } catch (err: any) {
    console.log(
      "❌ Post Live Location Error:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
 GET VISITS 
 ------------------------------------------------ */
export const getVisits = async () => {
  try {
    const res = await api.get("/visit/get");
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error fetching visits:",
      err.response?.data || err.message,
    );
    return { success: false };
  }
};

/* -------------------------------------------------
 POST VISITS 
 ------------------------------------------------ */
export const postVisit = async (visitData: any) => {
  try {
    const formData = new FormData();
    formData.append("taskName", visitData.taskName);
    formData.append("type", visitData.type);
    formData.append("notes", visitData.notes);
    formData.append("status", visitData.status);
    formData.append("date", visitData.date);
    if (visitData.imageUri) {
      const filename = visitData.imageUri.split("/").pop();
      const ext = filename?.split(".").pop();
      formData.append("image", {
        uri: visitData.imageUri,
        name: filename,
        type: `image/${ext}`,
      } as any);
    }
    const res = await api.post("/visit/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Error posting visit:", err.response?.data || err.message);
    throw err;
  }
};

/* -------------------------------------------------
 PUT VISITS 
 ------------------------------------------------ */
export const updateVisit = async (id: string, visitData: any) => {
  try {
    const formData = new FormData();
    formData.append("taskName", visitData.taskName);
    formData.append("type", visitData.type);
    formData.append("status", visitData.status);
    formData.append("date", visitData.date);
    formData.append("notes", visitData.notes);
    if (visitData.imageUri && visitData.imageUri.startsWith("file")) {
      const filename = visitData.imageUri.split("/").pop();
      const ext = filename?.split(".").pop();
      formData.append("image", {
        uri: visitData.imageUri,
        name: filename,
        type: `image/${ext}`,
      } as any);
    }
    const res = await api.put(`/visit/put/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error updating visit:",
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* -------------------------------------------------
 DELETE VISITS 
 ------------------------------------------------ */
export const deleteVisit = async (id: string) => {
  try {
    const res = await api.delete(`/visit/delete/${id}`);
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error deleting visit:",
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* -------------------------------------------------
 GET VISIT IMAGE 
 ------------------------------------------------ */
export const fetchVisitImageBase64 = async (id: string) => {
  try {
    const res = await api.get(`/visit/image/${id}`, {
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
    console.error(
      "❌ Error fetching visit image:",
      err.response?.data || err.message,
    );
    return null;
  }
};

/* -------------------------------------------------
 POST REPORT 
 ------------------------------------------------ */
export const postReport = async (reportData: any) => {
  try {
    const formData = new FormData();
    formData.append("clientName", reportData.clientName);
    formData.append("purpose", reportData.purpose);
    formData.append("notes", reportData.notes);
    console.log("📤 Uploading Report:", {
      hasImage: !!reportData.imageUri,
      uri: reportData.imageUri,
      clientName: reportData.clientName,
    });
    if (reportData.imageUri && reportData.imageUri.startsWith("file://")) {
      formData.append("image", {
        uri: reportData.imageUri,
        name: "report.jpg",
        type: "image/jpeg",
      } as any);
    }
    const res = await api.post("/report/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ POST Report Error:", err.response?.data || err.message);
    throw err;
  }
};

/* -------------------------------------------------
 GET REPORTS
 ------------------------------------------------ */
export const getReports = async () => {
  try {
    const res = await api.get("/report/get");
    const reports = res.data.reports || [];
    reports.totalReports = res.data.totalReports || reports.length;
    return reports;
  } catch (err: any) {
    console.error(
      "❌ Error fetching reports:",
      err.response?.data || err.message,
    );
    return [];
  }
};

/* -------------------------------------------------
 PUT REPORTS 
 ------------------------------------------------ */
export const updateReport = async (id: string, reportData: any) => {
  try {
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
    const res = await api.put(`/report/put/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Update Report Error:", err.response?.data || err.message);
    throw err;
  }
};

/* -------------------------------------------------
 GET REPORT IMAGE 
 ------------------------------------------------ */
export const fetchReportImageBase64 = async (id: string) => {
  try {
    const res = await api.get(`/report/image/${id}`, {
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
    console.error(
      "❌ Error fetching image:",
      err.response?.data || err.message,
    );
    return null;
  }
};

/* -------------------------------------------------
 POST CLIENT 
 ------------------------------------------------ */
export const addClient = async (clientData: any) => {
  try {
    const formData = new FormData();
    formData.append("name", clientData.name);
    formData.append("address", clientData.address);
    formData.append("latitude", String(clientData.latitude));
    formData.append("longitude", String(clientData.longitude));
    formData.append("clientNumber", clientData.clientNumber);
    if (clientData.imageUri) {
      formData.append("image", {
        uri: clientData.imageUri,
        name: "client.jpg",
        type: "image/jpeg",
      } as any);
    }
    const res = await api.post("/client/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.log("❌ Add Client Error:", err.response?.data || err.message);
    return null;
  }
};

/* -------------------------------------------------
 GET CLIENT 
 ------------------------------------------------ */
export const getClients = async () => {
  try {
    const res = await api.get("/client/get");
    return res.data;
  } catch (err: any) {
    console.log("❌ Fetch Clients Error:", err.response?.data || err.message);
    return null;
  }
};

/* -------------------------------------------------
 PUT CLIENT 
 ------------------------------------------------ */
export const updateClient = async (id: string, clientData: any) => {
  try {
    const formData = new FormData();
    formData.append("name", clientData.name);
    formData.append("address", clientData.address);
    formData.append("latitude", String(clientData.latitude));
    formData.append("longitude", String(clientData.longitude));
    formData.append("clientNumber", clientData.clientNumber);
    if (clientData.imageUri) {
      formData.append("image", {
        uri: clientData.imageUri,
        name: "client.jpg",
        type: "image/jpeg",
      } as any);
    }
    const res = await api.put(`/client/put/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.log("❌ Update Client Error:", err.response?.data || err.message);
    return null;
  }
};

/* -------------------------------------------------
 GET CLIENT IMAGE
 ------------------------------------------------ */
export const fetchClientImage = async (id: string) => {
  try {
    const res = await api.get(`/client/image/${id}`, {
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
    console.log("❌ Fetch Image Error:", err.response?.data || err.message);
    return null;
  }
};

//-----------------------------> FOR ADMIN <-----------------------------------------//

/* -------------------------------------------------
 GET NOTIFICATIONS 
 ------------------------------------------------ */
export const getNotifications = async () => {
  try {
    const res = await api.get("/notification/get");
    return res.data;
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
 ------------------------------------------------ */
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
 DELETE ALL NOTIFICATIONS 
 ------------------------------------------------ */
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
 APPROVE OR DECLINE CLIENT 
 ------------------------------------------------ */
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

/* -------------------------------------------------
 GET EMPLOYEE PROFILE IMAGE 
 ------------------------------------------------ */
export const fetchEmployeeProfilePhoto = async (email: string) => {
  try {
    const res = await api.get(`/profile/photo/${email}`, {
      responseType: "blob",
    });
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(res.data);
    });
    return base64; // Already contains data:image/jpeg;base64,...
  } catch (err: any) {
    console.log("❌ Admin Fetch Photo Error:", err?.message);
    return null;
  }
};

/* -------------------------------------------------
 GET EMPLOYEE PROFILE DATA
 ------------------------------------------------ */
export const fetchEmployeeProfileMeta = async (email: string) => {
  try {
    const res = await api.get(`/profile/photo/${email}?meta=true`);
    return res.data.profile;
  } catch (err) {
    console.log("Admin Get Employee Profile Error:", err);
    return null;
  }
};

/* -------------------------------------------------
 GET DASHBOARD 
 ------------------------------------------------ */
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
 ADD EMPLOYEE 
 ------------------------------------------------ */
export const adminAddEmployee = async (employeeData: any) => {
  try {
    const res = await api.post("/plan/add-employee", employeeData);
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error adding employee:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

/* -------------------------------------------------
 GET EMPLOYEE 
 ------------------------------------------------ */
export const adminGetEmployees = async () => {
  try {
    const res = await api.get("/plan/employees");
    const employees = res.data.employees || [];
    const totalEmployees = employees.length;
    employees.totalEmployees = totalEmployees;
    return employees;
  } catch (err: any) {
    console.error(
      "❌ Error fetching employees:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

/* -------------------------------------------------
 DELETE EMPLOYEE 
 ------------------------------------------------ */
export const adminDeleteEmployee = async (employeeEmail: string) => {
  try {
    const encodedEmail = encodeURIComponent(employeeEmail);
    const res = await api.delete(`/plan/employee/${encodedEmail}`);
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error deleting employee:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

/* -------------------------------------------------
 GET ALL EMPLOYEES LOCATION
 ------------------------------------------------ */
export const getAllLiveLocations = async () => {
  try {
    const res = await api.get("/location/live");
    return res.data.locations; // only return list
  } catch (err: any) {
    console.log(
      "❌ Fetch Live Locations Error:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
 GET EMPLOYEES LIVE LOCATION
 ------------------------------------------------ */
export const getEmployeeLiveLocation = async (empEmail: string) => {
  try {
    const res = await api.get(`/location/live/${empEmail}`);
    return res.data.employeeLive;
  } catch (err: any) {
    console.log(
      "❌ Fetch Employee Live Location Error:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
 GET EMPLOYEES LOCATION HISTORY
 ------------------------------------------------ */
export const getEmployeeLocationHistory = async (
  empEmail: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    const params: any = { employeeEmail: empEmail };
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
    const res = await api.get("/location/history", { params });
    return res.data.history;
  } catch (err: any) {
    console.log(
      "❌ Fetch Location History Error:",
      err.response?.data || err.message,
    );
    throw err.response?.data || { message: err.message };
  }
};

/* -------------------------------------------------
 GET VISITS
 ------------------------------------------------ */
export const adminGetVisits = async (employeeEmail?: string) => {
  try {
    const res = await api.get("/visit/admin", {
      params: employeeEmail ? { employeeEmail } : {},
    });
    return {
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
    return { visits: [], totalVisits: 0, completed: 0, employees: [] };
  }
};

/* -------------------------------------------------
 GET REPORTS
 ------------------------------------------------ */
export const adminGetReports = async (date?: string) => {
  try {
    const res = await api.get("/report/admin", {
      params: date ? { date } : {},
    });
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Admin report fetch error:",
      err.response?.data || err.message,
    );
    return { reports: [], employeeCounts: [] };
  }
};

/* -------------------------------------------------
 DELETE REPORTS
 ------------------------------------------------ */
export const adminDeleteReport = async (id: string) => {
  try {
    const res = await api.delete(`/report/delete/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Delete Report Error:", err.response?.data || err.message);
    throw err;
  }
};

/* -------------------------------------------------
 GET CLIENTS
 ------------------------------------------------ */
export const adminGetClients = async () => {
  try {
    const res = await api.get("/client/admin");
    return res.data;
  } catch (err: any) {
    console.log(
      "❌ Admin Fetch Clients Error:",
      err.response?.data || err.message,
    );
    return null;
  }
};

/* -------------------------------------------------
 DELETE CLIENTS
 ------------------------------------------------ */
export const adminDeleteClient = async (id: string) => {
  try {
    const res = await api.delete(`/client/delete/${id}`);
    return res.data;
  } catch (err: any) {
    console.log("❌ Delete Client Error:", err.response?.data || err.message);
    return null;
  }
};

/* -------------------------------------------------
 ADMIN POST LOCATION TO SUPER ADMIN
 ------------------------------------------------ */
export const postAdminAddress = async (address: string) => {
  try {
    const res = await api.post("/admintrack", { address });
    if (res.data?.success) {
      return {
        success: true,
        message: res.data.message,
        track: res.data.track,
      };
    }
    return {
      success: false,
      message: res.data?.message || "Failed to update address",
    };
  } catch (err: any) {
    console.error(
      "❌ Error posting admin address:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

/* -------------------------------------------------
 ADMIN POST STATUS TO SUPER ADMIN
 ------------------------------------------------ */
export const postUserStatus = async (status: "active" | "inactive") => {
  try {
    const res = await api.post("/admintrack/status", { status });
    if (res.data?.success) {
      return {
        success: true,
        message: res.data.message,
        track: res.data.track,
      };
    }
    return {
      success: false,
      message: res.data?.message || "Failed to update status",
    };
  } catch (err: any) {
    console.error(
      "❌ Error posting user status:",
      err.response?.data || err.message,
    );
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};
