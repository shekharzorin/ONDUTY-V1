// app/screens/UserScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getAllPlans, upgradePlan } from "../backend-api/api";
import Btn from "../components/Btn";
import PageHeader from "../components/PageHeader";
import styles from "../stylesheet/globalstylesheet";

// 🔹 Human-readable feature labels
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

const UserScreen = () => {
  const [plans, setPlans] = useState<Record<string, any> | null>(null);
  const [plansLoading, setPlansLoading] = useState(true); // for fetching plans
  const [buttonLoading, setButtonLoading] = useState<string | null>(null); // for plan upgrade buttons

  // 🧠 Fetch all plans on load
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        if (data.success) setPlans(data.plans);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (plansLoading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={[styles.flex, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Loading plans...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <PageHeader title="Upgrade Plan" />

        <Text style={[styles.marginBottom1, { textAlign: "center"}]}>
          Please upgrade your plan to unlock premium features.
        </Text>

        <ScrollView style={[styles.paddinghorizontal]}>
          {plans &&
            Object.entries(plans).map(([planName, features]) => (
              <View key={planName}  style={[styles.statusframe, styles.gap, styles.marginBottom1]}>
                <Text style={[styles.status, { textAlign: "center", textTransform: "capitalize" }]}>{planName} Plan</Text>

                {/* ✅ Display features */}
                <View>
                  {Object.entries(featureLabels).map(([key, label]) => (
                    <Text key={key} style={[ styles.plantxt, { lineHeight: 26, color: features[key as keyof typeof features] ? "#000" : "#f55"}]}>
                      {features[key as keyof typeof features] ? "✅" : "❌"}{" "}{label}
                    </Text>
                  ))}
                </View>

                {/* 🔘 Upgrade buttons */}
                <View style={[styles.rowitem, styles.margintop]}>
                {planName !== "trial" ? (
                  <>
                    {/* Monthly Button */}
                    <Btn title={ buttonLoading === planName + "-monthly" ? "Upgrading..." : "Monthly" }
                        onPress={async () => { setButtonLoading(planName + "-monthly");
                          try {
                              const res = await upgradePlan(planName, "monthly");
                              Alert.alert("✅ Success", "Login again", [
                              {
                                  text: "OK",
                                  onPress: () => router.push("/authentication/login"),
                              },
                              ]);
                          } catch (err: any) {
                              Alert.alert(
                              "❌ Error",
                              err.message || "Failed to upgrade"
                              );
                          } finally {
                              setButtonLoading(null);
                          }
                          }}
                        disabled={buttonLoading !== null} style={styles.width48}
                    />

                    {/* Yearly Button */}
                    <Btn title={ buttonLoading === planName + "-yearly" ? "Upgrading..." : "Yearly"}
                        onPress={async () => { setButtonLoading(planName + "-yearly");
                          try {
                              const res = await upgradePlan(planName, "yearly");
                              Alert.alert("✅ Success", "Login again", [
                              {
                                  text: "OK",
                                  onPress: () => router.push("/authentication/login"),
                              },
                          ]);
                          } catch (err: any) {
                              Alert.alert(
                              "❌ Error",
                              err.message || "Failed to upgrade"
                              );
                          } finally {
                              setButtonLoading(null);
                          }
                          }}
                        disabled={buttonLoading !== null} style={styles.width48}
                    />
                  </>
                ) : (
                    <Btn title={ buttonLoading === planName + "-trial" ? "Activating..." : "Get Access" }
                      onPress={async () => { setButtonLoading(planName + "-trial");
                          try {
                          const res = await upgradePlan("trial");
                          Alert.alert("✅ Success", "Login again", [
                              {
                              text: "OK",
                              onPress: () => router.push("/authentication/login"),
                              },
                          ]);
                          } catch (err: any) {
                          Alert.alert(
                              "❌ Error",
                              err.message || "Failed to start trial"
                          );
                          } finally {
                          setButtonLoading(null);
                          }
                      }}
                      disabled={buttonLoading !== null}
                    />
                )}
                </View>
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default UserScreen;
