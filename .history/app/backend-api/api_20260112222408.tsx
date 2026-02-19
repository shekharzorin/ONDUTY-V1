import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllPlans = async () => {
  try {
    const res = await api.get("/plans");
    return res.data;
  } catch (error: any) {
    console.error(
      "❌ Fetch plans error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch plans",
      plans: [],
    };
  }
};

export default api;
