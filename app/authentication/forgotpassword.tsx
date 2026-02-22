import { forgotPassword } from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import InputBox from "@/app/components/InputBox";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../stylesheet/globalstylesheet";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("❌ Error", "Please enter your registered email");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email.trim());

      if (res.success && res.token) {
        // ✅ User found, navigate to reset password screen with token
        Alert.alert(
          "✅ Success",
          "User found! Proceed to reset password.",
          [
            {
              text: "OK",
              onPress: () =>
                router.replace({ pathname: "/authentication/resetpassword",
                  params: { token: res.token }, // ✅ pass correct param name
                }),
            },
          ]
        );
      } else {
        Alert.alert("❌ Failed", res.message || "Unable to find user");
      }
    } catch (error: any) {
      console.error("❌ Forgot Password Error:", error);
      Alert.alert("❌ Error", error.message || "Something went wrong");
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
            <Text style={[styles.header, styles.marginBottom]}>
              Forgot Password
            </Text>
          </View>

          <View style={styles.centeralign}>
            <Text style={[styles.locationtxt,styles.fontweight, {textAlign:'center'}]}>
              Enter your registered email to reset your password
            </Text>
          </View>

          <InputBox
            placeholder="Enter your registered email"
            keyboardType="email-address"
            value={email}
            setValue={setEmail}
            icon="mail"
          />
        </View>
      </SafeAreaView>

      <View style={[ styles.paddinghorizontal, styles.gap, styles.mtop, {marginBottom: 100}]}>
        <Btn title={loading ? "Checking..." : "Find User"} disabled={loading} onPress={handleReset}/>
        <TouchableOpacity onPress={() => router.replace("/authentication/login")} style={styles.centeralign}>
          <Text style={[styles.locationtxt,styles.fontweight]}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

export default ForgotPassword;