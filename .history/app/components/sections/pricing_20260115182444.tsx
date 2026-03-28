"use client";

import { useEffect, useState } from "react";
import { getAllPlans } from "@/app/backend-api/api";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import { motion, Variants } from "framer-motion";
import PricingSkeleton from "@/app/components/ui/PricingSkeleton";

/* -------------------- CONSTANTS -------------------- */

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

/* -------------------- ANIMATION VARIANTS -------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/* -------------------- COMPONENT -------------------- */

const Pricing = () => {
  const [plans, setPlans] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const router = useRouter();

  /* -------------------- FETCH PLANS -------------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        setPlans(data);
        console.log("Fetched plans:", data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  /* -------------------- HANDLERS -------------------- */

  const handleUpgrade = async (planName: string, type?: string) => {
    setButtonLoading(planName + (type ? `-${type}` : ""));
    try {
      alert("✅ Success! Please login again.");
      // router.push("/authentication/login");
    } catch (err: any) {
      alert("❌ Error: " + (err.message || "Failed to upgrade"));
    } finally {
      setButtonLoading(null);
    }
  };

  /* -------------------- RENDER -------------------- */

  return (
    <section className="flex flex-col w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-10 mb-15">
        <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
          <p className="text-2xl lg:text-3xl font-bold leading-[1.15]">
            Upgrade Plan
          </p>
          <p className="md:text-lg text-(--color-gray)">
            Please upgrade your plan to unlock premium features.
          </p>
        </div>

        {/* Loading state */}
        {loading && <PricingSkeleton  />}

        {/* Cards */}
        {!loading && Object.keys(plans).length > 0 && (
          <motion.div
            key={Object.keys(plans).length} // 🔑 forces animation after data load
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex items-center justify-center gap-5 md:gap-10 flex-wrap"
          >
            {Object.entries(plans).map(([planName, features]) => {
              const price = planPrices[planName];

              return (
                <motion.div
                  key={planName}
                  variants={cardVariants}
                  className="flex flex-col backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl w-full md:w-fit gap-3 p-10 hover:shadow-[#8d8d8d] hover:scale-110 transition duration-300"
                >
                  {/* Plan name */}
                  <p className="text-center font-bold text-xl">
                    {planName.charAt(0).toUpperCase() + planName.slice(1)}
                  </p>

                  {/* Price */}
                  <div className="flex flex-col">
                    {planName === "trial" ? (
                      <>
                        <p className="text-3xl font-bold text-green-600">
                          Free
                          <span className="text-lg text-(--color-gray)">
                            {" "}
                            / 7 days
                          </span>
                        </p>
                        <p className="text-(--color-gray)">₹0 upto 7 days</p>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-bold">
                          ₹{price?.monthly}
                          <span className="text-lg text-(--color-gray)">
                            {" "}
                            / month
                          </span>
                        </p>
                        <p className="text-(--color-gray)">
                          ₹{price?.yearly} billed yearly
                        </p>
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-4">
                    {Object.entries(featureLabels).map(([key, label]) => (
                      <li
                        key={`${planName}-${key}`}
                        className="font-medium"
                        style={{
                          lineHeight: "2em",
                          color: features[key] ? "#000" : "#f55",
                        }}
                      >
                        {features[key] ? "✅" : "❌"} {label}
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <div className="flex gap-2 justify-center">
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
                          className="border border-white p-4 w-full rounded-full bg-[#fff0cd]/50 hover:bg-[#eccfff] text-black/50"
                        />
                        <Button
                          title={
                            buttonLoading === planName + "-yearly"
                              ? "Upgrading..."
                              : "Yearly"
                          }
                          onClick={() => handleUpgrade(planName, "yearly")}
                          disabled={buttonLoading !== null}
                          className="border border-white p-4 w-full rounded-full bg-[#fff0cd]/50 hover:bg-[#eccfff] text-black/50"
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
                        className="border border-white p-4 w-full rounded-full bg-[#fff0cd]/50 hover:bg-[#eccfff] text-black/50"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
