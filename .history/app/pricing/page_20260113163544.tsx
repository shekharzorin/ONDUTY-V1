"use client";

import { useEffect, useState } from "react";
import { getAllPlans } from "@/app/backend-api/api";
import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";
import { Slice } from "lucide-react";

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
      //router.push("/authentication/login");
    } catch (err: any) {
      alert("❌ Error: " + (err.message || "Failed to upgrade"));
    } finally {
      setButtonLoading(null);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50">
      {/* Header */}
      <div className="flex flex-col gap-15 mb-15">
        <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
          <p className="text-xl md:text-2xl lg:text-2xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
            Upgrade Plan
          </p>
          <p className="md:text-xl lg:text-lg xl:text-xl lg:mt-2 xl:mt-2 text-(--color-gray) lg:text-balance">
            Please upgrade your plan to unlock premium features.
          </p>
        </div>

        {/* Cards container */}
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {Object.entries(plans).map(([planName, features]) => {
            const price = planPrices[planName];

            return (
              <div
                key={planName}
                className="flex flex-col backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl w-[90%] md:w-fit gap-3 p-10 hover:shadow-[#8d8d8d] hover:scale-105 hover:rotate-1 transition-hover duration-300"
              >
                <p className="text-center font-bold text-xl">
                  {planName.charAt(0).toUpperCase() + planName.slice(1)}
                </p>

                <div className="flex flex-col">
                  {planName === "trial" ? (
                    <>
                      <p className="text-3xl font-bold text-green-600 py-3">
                        Free
                        <span className="text-lg text-gray-500"> / 7 days</span>
                        <p className="text-gray-500">₹0</p>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold">
                        ₹{price?.monthly}
                        <span className="text-lg text-gray-500"> / month</span>
                      </p>
                      <p className="text-gray-500">
                        ₹{price?.yearly} billed yearly
                      </p>
                    </>
                  )}
                </div>

                <div className="flex">
                  <ul className="mb-4">
                    {Object.entries(featureLabels).map(([key, label]) => (
                      <p
                        key={`${planName}-${key}`}
                        style={{
                          lineHeight: "2em",
                          color: features[key] ? "#000" : "#f55",
                        }}
                        className="font-medium"
                      >
                        {features[key] ? "✅" : "❌"} {label}
                      </p>
                    ))}
                  </ul>
                </div>

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
                        className="border border-white p-4 w-full rounded-full bg-[#fff0cd]/50 text-black hover:bg-[#eccfff]"
                      />
                      <Button
                        title={
                          buttonLoading === planName + "-yearly"
                            ? "Upgrading..."
                            : "Yearly"
                        }
                        onClick={() => handleUpgrade(planName, "yearly")}
                        disabled={buttonLoading !== null}
                        className="border border-white p-4 w-full rounded-full bg-[#fff0cd]/50 text-black hover:bg-[#eccfff]"
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
                      className="border border-white p-4 w-full rounded-full bg-[#fff0cd]/50 text-black hover:bg-[#eccfff]"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="flex items-center w-full my-15 border-amber-600 border">
        <div className="flex flex-wrap justify-between gap-6 w-full">
          {Object.entries(plans).map(([planName, features]) => {
            const price = planPrices[planName];

            return (
              <div
                key={planName}
                className="p-6 rounded-3xl bg-(--color-sidebar) shadow-md hover:shadow-[#8d8d8d] hover:scale-105 hover:rotate-2 transition-hover duration-300 flex flex-col"
              >

                
                <p className="text-center text-lg font-semibold capitalize mb-4">
                  {planName} Plan
                </p>



                <div className="my-4">
                  {planName === "trial" ? (
                    <p className="text-3xl font-bold text-green-600">Free</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold">
                        ₹{price?.monthly}
                        <span className="text-sm text-gray-500"> / month</span>
                      </p>
                      <p className="text-gray-400">
                        ₹{price?.yearly} billed yearly
                      </p>
                    </>
                  )}
                </div>



                <ul className="mb-4">
                  {Object.entries(featureLabels).map(([key, label]) => (
                    <p
                      key={`${planName}-${key}`}
                      style={{
                        lineHeight: "2em",
                        color: features[key] ? "#000" : "#f55",
                      }}
                      className="font-medium"
                    >
                      {features[key] ? "✅" : "❌"} {label}
                    </p>
                  ))}
                </ul>



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
      </div> */}
    </div>
  );
};

export default page;
