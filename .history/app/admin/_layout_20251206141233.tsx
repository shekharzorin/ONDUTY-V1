import { refreshAccessToken } from "@/app/backend-api/api"; // make sure path is correct
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

function Admin() {
  // ✅ Auto-refresh token every 14 mins
  useEffect(() => {
    const interval = setInterval(() => refreshAccessToken(), 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
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
  );
}

export default Admin;
