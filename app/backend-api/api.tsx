import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------------------------------------------------
   1) SEND OTP
------------------------------------------------------------------ */
export const sendOtp = async (email: string) => {
  try {
    const res = await api.post("/user/send-otp", {
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
   2) REGISTER USER
------------------------------------------------------------------ */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  otp: string,
) => {
  try {
    const res = await api.post("/user/register", {
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
   3) GET ALL PLANS
------------------------------------------------------------------ */
export const getAllPlans = async () => {
  try {
    const res = await api.get("/plan");
    return {
      success: true,
      message: res.data?.message,
      plans: res.data?.plans || [],
    };
  } catch (error: any) {
    console.error(
      "❌ Fetch plans error:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch plans",
      plans: [],
    };
  }
};

/* ------------------------------------------------------------------
   4) BOOK DEMO REQUEST
------------------------------------------------------------------ */
export const bookDemoRequest = async (
  name: string,
  email: string,
  mobile: string,
  message: string,
) => {
  try {
    const res = await api.post("/bookdemo/request", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      message: message.trim(),
    });
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to send demo request",
    };
  }
};

export default api;
