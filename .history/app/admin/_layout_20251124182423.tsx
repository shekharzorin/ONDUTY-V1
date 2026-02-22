import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

function admin() {
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
          tabBarIcon: ({ color,size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="tracking" 
        options={{
          headerShown: false,
          title: "Tracking",
          tabBarIcon: ({ color,size }) => (
            <FontAwesome5 name="map-marker-alt" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="report" 
        options={{
          headerShown: false,
          title: "Report",
          tabBarIcon: ({ color,size }) => (
          <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="clients" 
        options={{
          headerShown: false,
          title: "Clients",
          tabBarIcon: ({ color,size }) => (
          <FontAwesome5 name="handshake" size={size} color={color} solid />
          ),
        }}
      />

    </Tabs>
  )
}

export default admin
