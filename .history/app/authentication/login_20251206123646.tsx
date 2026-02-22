// 📁 app/authentication/login.tsx
import { loginUser } from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import InputBox from "@/app/components/InputBox";
import AdminLocationTracker from "@/app/services/AdminTracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../stylesheet/globalstylesheet";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("❌ Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(email.trim(), password.trim());

      if (res.success && res.user) {
        // ✅ FIXED: Use correct token key from backend (accessToken)
        if (res.accessToken) {
          await AsyncStorage.setItem("authToken", res.accessToken);
        }

        await AsyncStorage.setItem("user", JSON.stringify(res.user));

        Alert.alert("✅ Success", "Login successful!", [
          {
            text: "OK",
            onPress: async () => {
              if (res.user.role === "admin") {
                await AdminLocationTracker.startTracking();
                router.replace("/admin/dashboard");
              } else if (res.user.role === "employee") {
                router.replace("/employee/dashboard");
              } else {
                router.replace("/user/user");
              }
            },
          },
        ]);
      } else {
        Alert.alert("❌ Login Failed", res.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);
      Alert.alert("❌ Error", error.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const preventBack = () => true;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      preventBack
    );

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.inputcard, styles.paddinghorizontal, styles.gap]}>
          <View style={[styles.centeralign, styles.gap]}>
            <Image source={require("../../assets/images/onduty-icon.png")} style={styles.logoimg} />
            <Text style={[styles.header, styles.marginBottom]}>Login</Text>
          </View>

          <InputBox
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            setValue={setEmail}
            icon="mail"
          />

          <InputBox
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            setValue={setPassword}
            icon="lock-closed"
            autoCapitalizeType="sentences"
          />

          <TouchableOpacity
            onPress={() => router.replace("/authentication/forgotpassword")}
            style={[styles.rightalign]}
          >
            <Text style={[styles.locationtxt, styles.fontweight]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={[styles.paddinghorizontal, styles.gap, styles.mtop, { marginBottom: 100 }]}>
        <Btn title={loading ? "Logging in..." : "Login"} disabled={loading} onPress={handleLogin} />

        <TouchableOpacity onPress={() => router.replace("/authentication/register")} style={[styles.centeralign]}>
          <Text style={[styles.locationtxt, styles.fontweight]}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

export default Login;
