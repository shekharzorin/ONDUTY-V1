import { registerUser, sendOtp } from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import InputBox from "@/app/components/InputBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../stylesheet/globalstylesheet";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false); // ⬅️ new
  const [registerLoading, setRegisterLoading] = useState(false);

  /* ------------------ SEND OTP ------------------ */
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("❌ Error", "Please enter your email");
      return;
    }

    try {
      setOtpLoading(true); // ⬅️ start loading
      const res = await sendOtp(email);

      // simulate network delay (optional, for smoother UI)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (res.success) {
        setOtpSent(true);
        Alert.alert("✅ OTP Sent", res.message || "Check your email for OTP");
      } else {
        Alert.alert("❌ Error", res.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      Alert.alert("❌ Error", error.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false); // ⬅️ stop loading
    }
  };

  /* ------------------ REGISTER ------------------ */
  const handleRegister = async () => {
    if (!name || !email || !password || !otp) {
      Alert.alert("❌ Error", "All fields are required");
      return;
    }

    const normalizedPassword = password.trim();
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;

    if (!strongPasswordRegex.test(normalizedPassword)) {
      Alert.alert(
        "❌ Weak Password",
        "Password must be at least 6 characters and include:\n- Uppercase letters\n- Lowercase letters\n- Numbers\n- Special characters (@ # & * .)"
      );
      return;
    }

    try {
      setRegisterLoading(true);
      const res = await registerUser(
        name.trim(),
        email.trim(),
        normalizedPassword,
        otp.trim()
      );

      if (res.success) {
        if (res.token) {
          await AsyncStorage.setItem("authToken", res.token);
        }

        Alert.alert("✅ Success", "Registration successful!", [
          {
            text: "OK",
            onPress: () => router.replace("/authentication/login"),
          },
        ]);
      } else {
        Alert.alert("❌ Failed", res.message || "Unable to register");
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      Alert.alert("❌ Registration Failed", error.message || "Server error");
    } finally {
      setRegisterLoading(true);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={[styles.inputcard, styles.paddinghorizontal, styles.gap]}>
            {/* Logo + Header */}
            <View style={[styles.centeralign, styles.gap]}>
              <Image source={require("../../assets/images/onduty-icon.png")} style={styles.logoimg}/>
              <Text style={[styles.header, styles.marginBottom]}>Register</Text>
            </View>

            {/* Name */}
            <InputBox
              placeholder="Enter your name"
              value={name}
              setValue={setName}
              icon="person"
              autoCapitalizeType="words"
            />

            {/* Email */}
            <InputBox
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              setValue={setEmail}
              icon="mail"
            />

            {/* OTP + Button */}
            <View style={styles.rowitem}>
              <View style={{ width: "55%" }}>
                <InputBox
                  placeholder="Enter OTP"
                  value={otp}
                  setValue={setOtp}
                  icon="shield-checkmark"
                  keyboardType="numeric"
                />
              </View>
              
              <Btn
                title={ otpLoading? "Sending OTP...": otpSent? "Resend OTP": "Get OTP"}
                onPress={handleSendOtp}
                disabled={otpLoading}
                style={{ width: "40%" }}
              />
            </View>

            {/* Password */}
            <InputBox
              placeholder="Create password"
              secureTextEntry
              value={password}
              setValue={setPassword}
              icon="lock-closed"
              autoCapitalizeType="sentences"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Footer */}
      <View style={[ styles.paddinghorizontal, styles.gap, styles.mtop, {marginBottom: 100}]}>
        <Btn title={registerLoading ? "Registering..." : "Register"} disabled={registerLoading} onPress={handleRegister}/>
        <TouchableOpacity onPress={() => router.push("/authentication/login")} style={styles.centeralign}>
          <Text style={[styles.locationtxt,styles.fontweight]}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

export default Register;
