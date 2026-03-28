"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/backend-api/api";
import InputBox from "@/app/components/Inputbox";
import Button from "@/app/components/Button";
import Logoheader from "@/app/components/Logoheader";
import Link from "next/link";
import { TbMailFilled } from "react-icons/tb";
import { MdLock } from "react-icons/md";
import AdminLocationTracker from "@/app/main/services/AdminLocationTracker";
import { storage } from "@/app/main/services/storage";

const page = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) return alert("Enter email and password");
    setLoading(true);
    storage.remove("accessToken");
    storage.remove("userRole");
    storage.remove("userId");
    storage.clear();

    const res = await loginUser(form.email, form.password);
    if (res.success && res.accessToken && res.user) {
      alert("✅ Login successful");
      storage.set("accessToken", res.accessToken);
      storage.set("refreshToken", res.refreshToken);
      storage.set("userRole", res.user.role);
      storage.set("userId", res.user.id);

      const role = res.user.role;
      if (role === "admin") {
        AdminLocationTracker.startTracking();
        router.replace("/main");
      } else if (role === "user") {
        router.replace("/upgradeplan");
      } else if (role === "employee") {
        router.replace("/accessdenied");
      } else {
        router.replace("/authentication/login");
      }
    } else {
      alert("❌ " + (res.message || "Login failed"));
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-(--color-sidebar)">
      <div className="bg-(--color-bg) flex flex-col items-center justify-center rounded-2xl shadow-md sm:w-[70%] md:w-[50%] lg:w-[30%]">
        <form className="flex flex-col w-full h-full p-10 gap-8 md:gap-15 items-center" onSubmit={(e) => e.preventDefault()} >
          <Logoheader title="Login" />

          <div className="flex flex-col w-full gap-3">
            <InputBox
              icon={<TbMailFilled size={24} />}
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              required
            />
            <InputBox
              icon={<MdLock size={26} />}
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
              required
            />
            <div className="flex justify-end w-full font-medium">
              <Link href="/authentication/forgotpassword">Forgot Password?</Link>
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 md:gap-5 mt-auto">
            <Button title={loading ? "Logging in..." : "Login"} onClick={handleLogin} disabled={loading} />
            <div className="flex justify-center w-full font-medium">
              <Link href="/authentication/register">
                <div>
                  Don't have an account?{" "}
                  <span className="text-(--color-primary)">Register</span>
                </div>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;