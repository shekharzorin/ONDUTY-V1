"use client";

import Button from "@/app/components/Button";
import InputBox from "@/app/components/Inputbox";
import Logoheader from "@/app/components/Logoheader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/backend-api/api";
import { TbMailFilled } from "react-icons/tb";

const page = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFindUser = async () => {
    if (!form.email.trim()) {
      alert("Please enter your registered email");
      return;
    }
    try {
      setLoading(true);
      const res = await forgotPassword(form.email);

      if (res.success) {
        alert("✅ User found! Proceed to reset password.");
        router.replace(`/authentication/resetpassword?token=${res.token}`);
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
          <Logoheader title="Forgot Password" />

          <div className="flex flex-col w-full gap-3">
            <p className="font-medium text-center">
              Enter your registered email <br /> to reset your password
            </p>
            <InputBox
              icon={<TbMailFilled size={24} />}
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              required
            />
          </div>

          <div className="flex flex-col w-full gap-3 md:gap-5 mt-auto">
            <Button
              title={loading ? "Please wait..." : "Find User"}
              onClick={handleFindUser}
              disabled={loading}
            />
            <div className="flex justify-center w-full font-medium">
              <Link href="/authentication/login">
                <div>
                  Back to
                  <span className="text-(--color-primary)"> Login</span>
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
