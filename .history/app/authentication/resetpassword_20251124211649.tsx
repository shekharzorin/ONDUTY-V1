import { resetPassword } from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import InputBox from "@/app/components/InputBox";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../stylesheet/globalstylesheet";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>(); // ✅ updated param name

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("❌ Error", "Please fill in both fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("❌ Error", "Passwords do not match");
      return;
    }

    if (!token) {
      Alert.alert("❌ Error", "Invalid or missing reset token");
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      Alert.alert(
        "❌ Weak Password",
        "Password must be at least 6 characters and include:\n- Uppercase letters\n- Lowercase letters\n- Numbers\n- Special characters (@ # & * .)"
      );
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(token, password);

      if (res.success) {
        Alert.alert("✅ Success", "Password reset successful!", [
          { text: "OK", onPress: () => router.replace("/authentication/login") },
        ]);
      } else {
        Alert.alert("❌ Failed", res.message || "Something went wrong");
      }
    } catch (error: any) {
      Alert.alert("❌ Error", error.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("/authentication/login"); // always go to login
      return true; // prevent default behavior
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);
  

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.inputcard, styles.paddinghorizontal, styles.gap]}>
          <View style={[styles.centeralign, styles.gap]}>
            <Image source={require("../../assets/images/onduty-icon.png")} style={styles.logoimg}/>
            <Text style={[styles.header, styles.marginBottom]}>Reset Password</Text>
          </View>

          <InputBox
            placeholder="Create password"
            secureTextEntry
            value={password}
            setValue={setPassword}
            icon="lock-closed"
            autoCapitalizeType="sentences"
          />

          <InputBox
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
            setValue={setConfirmPassword}
            icon="lock-closed"
            autoCapitalizeType="sentences"
          />
        </View>
      </SafeAreaView>
        <View style={[ styles.paddinghorizontal, styles.gap, styles.mtop, {marginBottom: 100}]}>
          <Btn title={loading ? "Resetting..." : "Reset Password"} onPress={handleReset} disabled={loading}/>
        </View>
    </SafeAreaProvider>
  );
};

export default ResetPassword;
