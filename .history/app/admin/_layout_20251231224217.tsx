import { validateToken } from "@/app/backend-api/api";
import StatusTracker from "@/app/services/StatusTracker";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

function AdminLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await validateToken();

      if (!valid) {
        await AsyncStorage.clear();
        router.replace("/authentication/login");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <>
      {/* 🔥 ADMIN ONLINE / OFFLINE TRACKER */}
      <StatusTracker />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#9777DE",
          tabBarInactiveTintColor: "#999",
          tabBarBackground: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: "#EFEFEF",
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            headerShown: false,
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="tracking"
          options={{
            headerShown: false,
            title: "Tracking",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="map-marker-alt" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="report"
          options={{
            headerShown: false,
            title: "Report",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="clients"
          options={{
            headerShown: false,
            title: "Clients",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="handshake" size={size} color={color} solid />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default AdminLayout;
