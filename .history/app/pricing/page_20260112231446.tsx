"use client";

import { useEffect, useState } from "react";
import { getAllPlans } from "@/app/backend-api/api";
import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";

const featureLabels: Record<string, string> = {
  visit: "Visit / Task management",
  report: "Report management",
  client: "Client management",
  liveLocation: "Live tracking",
  addEmployees: "Add Employees",
  adminViewAll: "Admin access",
  employeeIsolation: "Employee Isolation",
  employeeTrackingHistory: "Employee Tracking History",
};

const planPrices: Record<
  string,
  { monthly?: number; yearly?: number; label?: string }
> = {
  trial: { label: "Free" },
  silver: { monthly: 299, yearly: 2999 },
  gold: { monthly: 399, yearly: 3999 },
  diamond: { monthly: 499, yearly: 4999 },
};

const page = () => {
  const [plans, setPlans] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        setPlans(data);
        console.log(data + " Fetched data ");
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleUpgrade = async (planName: string, type?: string) => {
    setButtonLoading(planName + (type ? `-${type}` : ""));
    try {
      //await upgradePlan(planName, type);
      alert("✅ Success! Please login again.");
      router.push("/authentication/login");
    } catch (err: any) {
      alert("❌ Error: " + (err.message || "Failed to upgrade"));
    } finally {
      setButtonLoading(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading plans...
      </div>
    );

  return (
    <div className="flex flex-col bg-(--color-bg) w-full min-h-screen p-5">
      {/* Header (fixed at top) */}
      <div className="flex flex-col items-center mb-5">
        <p>Upgrade Plan</p>
        <p className="text-center text-(--color-gray)">
          Please upgrade your plan to unlock premium features.
        </p>
      </div>

      {/* Cards container (centered in remaining space) */}
      <div className="flex flex-1 justify-center items-center w-full">
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {Object.entries(plans).map(([planName, features]) => {
            const price = planPrices[planName];

            return (
              <div
                key={planName}
                className="sm:w-[80%] md:w-[60%] lg:w-[23%] p-6 rounded-3xl bg-(--color-sidebar) shadow-md hover:shadow-[#8d8d8d] hover:scale-105 hover:rotate-2 transition-hover duration-300 flex flex-col"
              >
                {/* Plan Name */}
                <h2 className="text-center text-lg font-semibold capitalize mb-4">
                  {planName} Plan
                </h2>

                {/* Price */}
                <div className="text-center mb-4">
                  {planName === "trial" ? (
                    <p className="text-3xl font-bold text-green-600">Free</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold">
                        ₹{price?.monthly}
                        <span className="text-sm text-gray-500"> / month</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        ₹{price?.yearly} billed yearly
                      </p>
                    </>
                  )}
                </div>

                {/* Feature List */}
                <ul className="mb-4">
                  {Object.entries(featureLabels).map(([key, label]) => (
                    <li
                      key={`${planName}-${key}`}
                      style={{
                        lineHeight: "2em",
                        color: features[key] ? "#000" : "#f55",
                      }}
                      className="font-medium"
                    >
                      {features[key] ? "✅" : "❌"} {label}
                    </li>
                  ))}
                </ul>

                {/* Upgrade Buttons */}
                <div className="flex gap-2 justify-center ">
                  {planName !== "trial" ? (
                    <>
                      <Button
                        title={
                          buttonLoading === planName + "-monthly"
                            ? "Upgrading..."
                            : "Monthly"
                        }
                        onClick={() => handleUpgrade(planName, "monthly")}
                        disabled={buttonLoading !== null}
                      />
                      <Button
                        title={
                          buttonLoading === planName + "-yearly"
                            ? "Upgrading..."
                            : "Yearly"
                        }
                        onClick={() => handleUpgrade(planName, "yearly")}
                        disabled={buttonLoading !== null}
                      />
                    </>
                  ) : (
                    <Button
                      title={
                        buttonLoading === planName + "-trial"
                          ? "Activating..."
                          : "Get Access"
                      }
                      onClick={() => handleUpgrade("trial")}
                      disabled={buttonLoading !== null}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
