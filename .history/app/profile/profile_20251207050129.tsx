import { getProfile, getProfileImage, postProfile } from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import History from "@/app/components/History";
import ProfileCard from "@/app/components/ProfileCard";
import AdminLocationTracker from "@/app/services/AdminTracker";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../stylesheet/globalstylesheet";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: "",
  });

  const [tempImage, setTempImage] = useState<string | null>(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // ⏳ Add small artificial delay (e.g., 800ms)
      await new Promise((resolve) => setTimeout(resolve, 300));

      const data = await getProfile();
      if (data.success) {
        const base64Image = await getProfileImage();
        setProfileData({
          name: data.profile.name,
          email: data.profile.email,
          mobile: data.profile.mobile,
          profilePic: base64Image || "",
        });
      } else {
        Alert.alert("Info", data.message || "Profile not found");
      }
    } catch (err: any) {
      console.error(err);

      // ✅ Handle Axios-specific errors
      if (err.response) {
        Alert.alert("Error", err.response.data?.message || "Server error occurred.");
      } else if (err.request) {
        Alert.alert("Error", "No response from server. Please check your connection.");
      } else {
        Alert.alert("Error", "Something went wrong while fetching profile.");
      }
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("❌ Permission Denied", "Gallery access is required to select a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setTempImage(result.assets[0].uri);
      Alert.alert("✅ Success", "Image selected successfully!");
    }
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("mobile", profileData.mobile);

      if (tempImage) {
        const filename = tempImage.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("profilePic", {
          uri: tempImage,
          name: filename,
          type,
        } as any);
      }
      const data = await postProfile(profileData.email, formData as any);

      if (data.success) {
        Alert.alert("✅ Success", "Profile updated successfully!");
        setTempImage(null);
        setImageRefreshKey(Date.now());
        fetchProfileData();
      } else {
        Alert.alert("❌ Error", data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Error", "Failed to update profile.");
    }
  };


  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            AdminLocationTracker.stopTracking();
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("authToken");

            // Use router.replace to go to login screen
            router.replace("/authentication/login");

          } catch (err) {
            console.error("⚠️ Error during logout:", err);
          }
        },
      },
    ]);
  };


  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.paddinghorizontal, styles.gap, styles.flex]}>
          <History title="Profile" onPress={() => router.back()} />

          <View style={[styles.centeralign, styles.gap]}>
            <Image key={imageRefreshKey}
              source={tempImage?{uri:tempImage}:profileData.profilePic?{ uri: profileData.profilePic }
                :require("../../assets/images/profile.webp")
              } style={styles.profile}
            />

            <View style={styles.iconbox}>
              <TouchableOpacity onPress={openGallery}>
                <Image source={require("../../assets/images/add-icon.png")}
                  style={styles.bellicon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.width100,{ top:-60 }, styles.gap]}>
            <ProfileCard
              title="Name : "
              placeholder="Enter your name"
              value={profileData.name}
              setValue={(text) => setProfileData({ ...profileData, name: text })}
              autoCapitalize="words"
            />

            <ProfileCard
              title="Mobile : "
              placeholder="Enter your mobile number"
              value={profileData.mobile}
              setValue={(text) => setProfileData({ ...profileData, mobile: text })}
              keyboardType="numeric"
            />

            <View style={[styles.profilecard, {gap:9}]}>
              <View style={styles.rowitem}>
                <Text style={styles.label}>Email :</Text>
                <View style={[styles.rowitem, styles.rightalign]}>
                  <FontAwesome name="ban" size={20} color="gray" style={{top:1}}/>
                  <Text style={[styles.label, {left:-15} ]}>Not editable</Text>
                </View>
              </View>
              <Text style={[styles.profiletext, {marginBottom:7}]}>
                {isLoading ?  "Please wait" : profileData?.email || "No data is found"}
              </Text>
            </View>

          </View>
        </View>

        <View style={[styles.rowitem, styles.paddinghorizontal]}>
          <Btn title="Update Profile" onPress={updateProfile} style={styles.width48} />
          <Btn title="Log Out" onPress={handleLogout} style={styles.width48} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Profile;