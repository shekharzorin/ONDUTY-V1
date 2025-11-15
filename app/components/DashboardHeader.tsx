import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../stylesheet/globalstylesheet"; // ✅ Import your global stylesheet

interface DashboardHeaderProps {
  imageRefreshKey: number;
  profileData: { profilePic?: string };
  isRunning?: boolean; // 👈 optional
  indicatorText?: [string, string]; // 👈 dynamic text pair [activeText, inactiveText]
  notifications: any[];
  onBellPress: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  imageRefreshKey,
  profileData,
  isRunning,
  indicatorText = ["Active", "Inactive"], // 👈 default fallback
  notifications,
  onBellPress,
}) => {
  const router = useRouter();

  return (
    <View style={styles.centeralign}>
      <View style={[styles.rowitem, { paddingTop: 25, gap: 40 }, styles.centeralign]}>
        {/* 👤 Profile Section */}
        <TouchableOpacity onPress={() => router.push("/profile/profile")}>
          <View style={[styles.rowitem, styles.centeralign]}>
            <View>
              <Image key={imageRefreshKey} source={ profileData.profilePic
                    ? { uri: profileData.profilePic }
                    : require("../../assets/images/profile.webp")
                } style={[styles.avatarheight, styles.profileavatar]}
              />

              {/* ✅ Show status only if isRunning prop exists */}
              {typeof isRunning !== "undefined" && (
                <View style={[styles.centeralign,styles.round,{backgroundColor:isRunning?"#01b021ff":"#c40505ff"}]}>
                  <Text style={{ color: "#fff" }}>
                    {isRunning ? indicatorText[0] : indicatorText[1]}
                  </Text>
                </View>
              )}
            </View>

            <View>
              <Text style={styles.txt}>Welcome</Text>
              <Text style={styles.quot}>Let's start today's work</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 🔔 Notification Bell */}
        <TouchableOpacity style={styles.rightalign} onPress={onBellPress}>
          <View>
            <Image source={require("../../assets/images/bell-icon.png")} style={styles.bellicon}/>
            {notifications.length > 0 && <View style={styles.reddot} />}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardHeader;
