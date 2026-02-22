import { getClients, getProfile, getProfileImage, getReports, getVisits, sendDashboardAction } from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import Dashcard from "@/app/components/Dashcard";
import MapComp from "@/app/components/MapComp";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import * as BackgroundFetch from "expo-background-fetch";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, AppState, FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "../components/DashboardHeader";
import History from "../components/History";
import styles from "../stylesheet/globalstylesheet";


const BACKGROUND_TIMER_TASK = "background-timer-task";

const formatTime = (time = 0) => {
  const hrs = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = time % 60;
  return `${String(hrs).padStart(2, "0")}h:${String(mins).padStart(2, "0")}m:${String(secs).padStart(2, "0")}s`;
};

const getFormattedDateTime = () => {
  const now = new Date();
  const dateString = now.toISOString().split("T")[0];
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  return { dateString, timeString };
};





// ---------------- BACKGROUND TASK --------------------------------------------------------------------------------------------------------------->

TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
  try {
    const storedStart = await AsyncStorage.getItem("clockInTime");
    const storedElapsed = await AsyncStorage.getItem("elapsedTime");
    const storedDate = await AsyncStorage.getItem("clockDate");
    const today = new Date().toISOString().split("T")[0];

    // Reset if new day
    if (storedDate && storedDate !== today) {
      await AsyncStorage.multiRemove(["clockInTime", "elapsedTime", "clockDate"]);
      console.log("🌙 Timer auto-reset in background at midnight");
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    // Update running time
    if (storedStart) {
      const diff = Math.floor((Date.now() - parseInt(storedStart, 10)) / 1000);
      const base = storedElapsed ? parseInt(storedElapsed, 10) : 0;
      await AsyncStorage.setItem("elapsedTime", (base + diff).toString());
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error("❌ Background task error:", err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const registerBackgroundTask = async () => {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
        minimumInterval: 15 * 60, // every 15 min
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("✅ Background timer task registered");
    } else {
      console.warn("⚠️ Background fetch not available");
    }
  } catch (err) {
    console.error("❌ Background task registration failed:", err);
  }
};





// ------------------------------------------------------------------------------------------------------------------------------------------------>

type Client = { id: string; name: string; latitude: number; longitude: number };
type NotificationItem = { id: string; message: string; time: string; fadeAnim?: Animated.Value };

const Dashboard = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({ profilePic: "" });
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState("");
  const [onJourney, setOnJourney] = useState(false);
  const [fromLocation, setFromLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const appState = useRef(AppState.currentState);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [clients, setClients] = useState<Client[]>([]);
  const isFocused = useIsFocused();
  const [clientImages, setClientImages] = useState<Record<string, string>>({});



  const fetchClients = async () => {
    try {
      const data = await getClients(); // data = { success, clients, totalClients }

      if (data?.clients) {
        setClients(data.clients); // only the array of clients
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      Alert.alert("❌ Error", "Unable to fetch clients");
      setClients([]);
    }
  };

  // auto refresh on screen focus
  useEffect(() => {
    if (isFocused) fetchClients();
  }, [isFocused]);



  // 🧩 Profile fetch ------------------------------------------------------------------------------------------------------------------------------>

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (data.success) {
        const profileImage = await getProfileImage();
        setProfileData({ profilePic: profileImage || "" });
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };





  // 🔔 Notification helper ------------------------------------------------------------------------------------------------------------------------>

  const addNotification = async (message: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, });
    const newNote: NotificationItem = { id: Date.now().toString(), message, time, fadeAnim: new Animated.Value(1) };
    const updated = [newNote, ...notifications];
    setNotifications(updated);
    await AsyncStorage.setItem("notifications", JSON.stringify(updated));
    await Notifications.scheduleNotificationAsync({
      content: { title: "Notification", body: message },
      trigger: null,
    });
  };

  const clearNotifications = async () => {
    await AsyncStorage.removeItem("notifications");
    setNotifications([]);
  };





  // 🛰 Check GPS every 5s -------------------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    const checkLocationStatus = async () => {
      try {
        const isEnabled = await Location.hasServicesEnabledAsync();
        if (!isEnabled) {
          addNotification("Please turn on location.");
          await Notifications.scheduleNotificationAsync({
            content: { title: "Location Off", body: "Please enable GPS for accurate tracking." },
            trigger: null,
          });
        }
      } catch (err) {
        console.error("Error checking location:", err);
      }
    };
    const interval = setInterval(checkLocationStatus, 5000);
    return () => clearInterval(interval);
  }, []);





  // 🔧 Register background task once -------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    registerBackgroundTask();
  }, []);





  //  Total Tasks Completed ------------------------------------------------------------------------------------------------------------------------->

  useFocusEffect(
    useCallback(() => {
      const fetchCompletedCount = async () => {
        try {
          setLoading(true);
          const data = await getVisits(); // calls /visit/get from backend
          if (data.success) {
            setCompletedCount(data.completed); // ✅ get only completed count
          }
        } catch (err) {
          console.error("❌ Error fetching completed count:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchCompletedCount();
    }, [])
  );





  //  Total Reports Completed ----------------------------------------------------------------------------------------------------------------------->

  useFocusEffect(
    useCallback(() => {
      const fetchTotalReports = async () => {
        try {
          setLoading(true);
          const reports = await getReports(); // ✅ calls /report/get
          setTotalReports(reports.totalReports || 0); // ✅ extract totalReports
        } catch (err) {
          console.error("❌ Error fetching total reports:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchTotalReports();
    }, [])
  );





  // 🟢 Clock-In ----------------------------------------------------------------------------------------------------------------------------------->

  const handleClockIn = async () => {
    try {
      Alert.alert(
        "🤝 Good Day!",
        "You have Clocked-In \n     \n— let’s make today productive!"
      );

      // ✅ ALREADY EXISTS (keep)
      const { dateString, timeString } = getFormattedDateTime();

      setLoading(true);

      const storedElapsed = await AsyncStorage.getItem("elapsedTime");
      const elapsed = storedElapsed ? parseInt(storedElapsed, 10) : 0;

      await AsyncStorage.setItem("clockInTime", Date.now().toString());
      await AsyncStorage.setItem("clockDate", dateString);

      // ✅ FIX: ADD dateString & timeString
      const res = await sendDashboardAction({
        type: "clock-in",
        dateString,
        timeString,
        status: "Active",
      } as any);

      if (res.success) {
        addNotification(`Clock-in`);
        setIsRunning(true);
      }
    } catch (err) {
      console.error("❌ Clock-in failed:", err);
    } finally {
      setLoading(false);
    }
  };






  // 🔴 Clock-Out ---------------------------------------------------------------------------------------------------------------------------------->

  const handleClockOut = async () => {
    try {
      Alert.alert(
        "👋 Good Job!",
        "You have Clocked-Out \n     \n— see you next time dear!"
      );

      const storedStart = await AsyncStorage.getItem("clockInTime");
      if (!storedStart) return;

      const storedElapsed = await AsyncStorage.getItem("elapsedTime");
      const prevElapsed = storedElapsed ? parseInt(storedElapsed, 10) : 0;

      const diff = Math.floor(
        (Date.now() - parseInt(storedStart, 10)) / 1000
      );

      const totalElapsed = prevElapsed + diff;

      await AsyncStorage.setItem("elapsedTime", totalElapsed.toString());
      await AsyncStorage.removeItem("clockInTime");

      // ✅ Convert to readable duration
      const hours = Math.floor(totalElapsed / 3600);
      const minutes = Math.floor((totalElapsed % 3600) / 60);
      const secondsR = totalElapsed % 60;

      const formattedDuration = `${hours
        .toString()
        .padStart(2, "0")}h:${minutes
          .toString()
          .padStart(2, "0")}m:${secondsR
            .toString()
            .padStart(2, "0")}s`;

      // ✅ ALREADY EXISTS (keep)
      const { dateString, timeString } = getFormattedDateTime();

      setLoading(true);

      // ✅ FIX: ADD dateString & timeString
      const res = await sendDashboardAction({
        type: "clock-out",
        dateString,
        timeString,
        workedHours: formattedDuration as any,
        status: "Inactive",
      } as any);

      if (res.success) {
        addNotification(`Clock-out`);
        setIsRunning(false);
      }
    } catch (err) {
      console.error("❌ Clock-out failed:", err);
    } finally {
      setLoading(false);
    }
  };






  // 🧭 Client Check-In / Check-Out with GPS ------------------------------------------------------------------------------------------------------->

  const handleClientToggle = async () => {
    try {
      // 🚨 Frontend guard
      if (!isRunning) {
        Alert.alert(
          "⛔ Action Not Allowed",
          "Please Clock-In before Client Check-In / Check-Out."
        );
        return;
      }

      const storedStart = await AsyncStorage.getItem("clockInTime");
      const storedDate = await AsyncStorage.getItem("clockDate");
      const today = new Date().toISOString().split("T")[0];

      if (!storedStart || storedDate !== today) {
        Alert.alert(
          "⛔ Session Expired",
          "Your work session is inactive. Please Clock-In again."
        );
        setIsRunning(false);
        return;
      }

      const { dateString, timeString } = getFormattedDateTime();

      if (!currentCoords) {
        addNotification("⚠️ Unable to get current location");
        return;
      }

      setLoading(true);

      const payload: any = {
        type: onJourney ? "client-check-out" : "client-check-in",
        dateString,
        timeString,
        clientName: selectedClient?.name || "Unknown Client",
        fromLocation: !onJourney ? currentCoords : fromLocation,
        toLocation: onJourney ? currentCoords : undefined,
      };

      const res = await sendDashboardAction(payload);

      if (res.success) {
        setOnJourney(!onJourney);

        Alert.alert(
          onJourney ? "✅ Client Check-Out" : "💼 Client Check-In",
          onJourney
            ? "You’ve checked out from the client location."
            : "You’ve checked in to the client location."
        );
      }
    } catch (err) {
      console.error("❌ Client check action failed:", err);
    } finally {
      setLoading(false);
    }
  };







  // Live time -------------------------------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getFormattedDateTime().timeString), 1000);
    return () => clearInterval(timer);
  }, []);





  // 🕒 Initialize + persist timer ----------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    const initializeTimer = async () => {
      const storedStart = await AsyncStorage.getItem("clockInTime");
      const storedElapsed = await AsyncStorage.getItem("elapsedTime");
      const storedDate = await AsyncStorage.getItem("clockDate");
      const today = new Date().toISOString().split("T")[0];

      // 🌙 Reset on new day
      if (storedDate && storedDate !== today) {
        await AsyncStorage.multiRemove(["clockInTime", "elapsedTime", "clockDate"]);
        setSeconds(0);
        setIsRunning(false);
        console.log("🕛 Timer reset (new day).");
        return;
      }

      // Resume timer
      if (storedStart) {
        const diff = Math.floor((Date.now() - parseInt(storedStart, 10)) / 1000);
        const base = storedElapsed ? parseInt(storedElapsed, 10) : 0;
        setSeconds(base + diff);
        setIsRunning(true);
      } else if (storedElapsed) {
        setSeconds(parseInt(storedElapsed, 10));
      }
    };

    initializeTimer();

    const interval = setInterval(async () => {
      const storedStart = await AsyncStorage.getItem("clockInTime");
      const storedElapsed = await AsyncStorage.getItem("elapsedTime");

      if (storedStart) {
        const diff = Math.floor((Date.now() - parseInt(storedStart, 10)) / 1000);
        const base = storedElapsed ? parseInt(storedElapsed, 10) : 0;
        setSeconds(base + diff);
      }

      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 2) {
        await AsyncStorage.multiRemove(["clockInTime", "elapsedTime", "clockDate"]);
        setSeconds(0);
        setIsRunning(false);
        console.log("🕛 Timer auto-reset at midnight");
      }
    }, 1000);

    const sub = AppState.addEventListener("change", async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") initializeTimer();
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, []);




  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSelectedLocation({ latitude: client.latitude, longitude: client.longitude });
    setModalVisible(false);
  };





  return (
    <>
      <SafeAreaProvider style={styles.dashboardcontainer}>
        {/* Header */}
        <DashboardHeader
          imageRefreshKey={imageRefreshKey}
          profileData={profileData}
          isRunning={isRunning}
          notifications={notifications}
          onBellPress={() => setNotificationModalVisible(true)}
        />

        <ScrollView style={styles.dashboardframe} contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.gap}>
            <View style={styles.rowitem}>
              <Dashcard
                title="Total Tasks Completed"
                number={completedCount}
                iconName="fact-check"
                iconLibrary="MaterialIcons"
              />
              <Dashcard
                title="Total Reports Submitted"
                number={totalReports}
                iconName="document-text"
                iconLibrary="Ionicons"
              />
            </View>

            <View style={styles.statusframe}>
              <View style={styles.rowitem}>
                <Text style={[styles.status, styles.color, styles.leftalign]}>Status</Text>
                <Text style={[styles.status, styles.rightalign]}>{currentTime}</Text>
              </View>
              <View style={styles.rowitem}>
                <Text style={[styles.status, styles.color, styles.leftalign]}>
                  {isRunning ? "Work in progress" : "Out of Work"}
                </Text>
                <Text style={[styles.status, styles.rightalign]}>{formatTime(seconds)}</Text>
              </View>
            </View>

            {/* Clock-In/Out */}
            <View style={{ alignItems: "center" }}>
              <View style={styles.centeralign}>
                <View style={[styles.rowitem, styles.width48]}>
                  <Btn title="Clock-In" onPress={handleClockIn} disabled={isRunning} />
                  <Btn title="Clock-Out" onPress={handleClockOut} disabled={!isRunning} />
                </View>
              </View>
            </View>

            {/* 🗺️ Map */}
            <MapComp
              selectedLocation={selectedLocation}
              selectedClient={selectedClient}
              onSelectClientPress={() => setModalVisible(true)}
              onLocationUpdate={(coords) => {
                setCurrentCoords(coords ?? null);
                setSelectedLocation(coords ?? undefined);
              }}
            />

            {/*------------------------------------------- Client model -------------------------------------------------------------------*/}

            <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
              <View style={styles.clientbox}>
                <View style={[styles.clientframe, { maxHeight: 300 }]}>
                  <Text style={[styles.status, styles.marginBottom1]}>Select Client</Text>
                  {clients.length > 0 ? (
                    <FlatList
                      data={clients}
                      keyExtractor={(item, index) =>
                        item.id?.toString() || index.toString()
                      }
                      renderItem={({ item }) => (
                        <TouchableOpacity key={item.id} onPress={() => handleClientSelect(item)} style={styles.padding10}>
                          <Text style={[styles.locationtxt, styles.color]}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <View style={[styles.centeralign, styles.marginVertical]}>
                      <Text style={[styles.locationtxt, styles.color]}>No clients found</Text>
                    </View>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>

        <View style={[styles.centeralign, styles.mtop, { backgroundColor: "#efefef" }, styles.paddinghorizontal]}>
          <Btn title={onJourney ? "Client Check-Out" : "Client Check-In"}
            onPress={handleClientToggle} disabled={!isRunning}
            style={[styles.width100, styles.marginBottom1]}
          />
        </View>
      </SafeAreaProvider>





      {/*------------------------------------ Full Screen Modals ---------------------------------------------------------------------*/}





      {/*------------------------------------ Notifications --------------------------------------------------------------------------*/}

      <Modal visible={notificationModalVisible} animationType="slide" transparent={false} onRequestClose={() => setNotificationModalVisible(false)}>
        <SafeAreaProvider style={styles.container}>
          <SafeAreaView style={styles.flex}>
            <View style={[styles.paddinghorizontal, styles.flex]}>
              <History title="Notifications" onPress={() => setNotificationModalVisible(false)} />
              <ScrollView>
                {notifications.length > 0 ? (
                  notifications.map((item) => {
                    let IconComponent: any = null;
                    let iconProps: any = { color: "#888", style: { margin: 10 } };
                    const msg = item.message.toLowerCase();

                    if (msg.includes("clock-in") || msg.includes("clock-out")) {
                      IconComponent = MaterialIcons;
                      iconProps = { ...iconProps, name: "timer", size: 36 };
                    } else if (
                      msg.includes("client check-in") ||
                      msg.includes("client check-out") ||
                      msg.includes("client journey")
                    ) {
                      IconComponent = FontAwesome5;
                      iconProps = { ...iconProps, name: "handshake", solid: true, size: 30 };
                    } else if (msg.includes("location")) {
                      IconComponent = FontAwesome5;
                      iconProps = { ...iconProps, name: "map-marker-alt", size: 32 };
                    }

                    return (
                      <Animated.View key={item.id} style={[styles.statusframe, styles.rowitem, styles.marginBottom1]}>
                        {IconComponent && <IconComponent {...iconProps} />}
                        <View>
                          <Text style={styles.status}>{item.message}</Text>
                          <Text style={[styles.locationtxt, styles.color]}>{item.time}</Text>
                        </View>
                      </Animated.View>
                    );
                  })
                ) : (
                  <View style={styles.centeralign}>
                    <Text style={[styles.locationtxt, styles.color]}>No notifications yet.</Text>
                  </View>
                )}
              </ScrollView>

              <View style={[styles.crossicon, { left: "47%" }]}>
                <TouchableOpacity onPress={clearNotifications}>
                  <Image source={require("../../assets/images/cross-icon.png")} style={styles.bellicon} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </>
  );
};

export default Dashboard;
