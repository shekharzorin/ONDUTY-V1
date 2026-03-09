"use client";

import Button from "@/app/components/Button";
import InputBox from "@/app/components/Inputbox";
import Logoheader from "@/app/components/Logoheader";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { resetPassword } from "@/app/backend-api/api";
import { MdLock } from "react-icons/md";

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = async () => {
    const { password, confirmPassword } = form;

    if (!password || !confirmPassword) return alert("❌ Fill all fields");
    if (password !== confirmPassword) return alert("❌ Passwords do not match");
    if (!token) return alert("❌ Invalid or missing token");

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      alert(
        "❌ Weak Password\n\n" +
          "Password must be at least 6 characters and include:\n" +
          "- Uppercase letters\n" +
          "- Lowercase letters\n" +
          "- Numbers\n" +
          "- Special characters (@ # & * .)"
      );

      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword(token, password);
      if (res.success) {
        alert("✅ Password reset successful!");
        router.replace("/authentication/login");
      } else {
        alert("❌ " + res.message);
      }
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-(--color-sidebar)">
      <div className="bg-(--color-bg) flex flex-col items-center justify-center rounded-2xl shadow-md sm:w-[70%] md:w-[50%] lg:w-[30%]">
        <form
          className="flex flex-col w-full h-full p-10 gap-8 md:gap-15 items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <Logoheader title="Reset Password" />

          <div className="flex flex-col w-full gap-3">
            <InputBox
              icon={<MdLock size={26} />}
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
              required
            />

            <InputBox
              icon={<MdLock size={26} />}
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(v) => handleChange("confirmPassword", v)}
              required
            />
          </div>

          <div className="flex flex-col w-full gap-3 md:gap-5 mt-auto">
            <Button
              title={loading ? "Please wait..." : "Reset Password"}
              onClick={handleReset}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
