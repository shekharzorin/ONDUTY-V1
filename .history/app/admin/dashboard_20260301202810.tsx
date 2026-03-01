import {
  adminGetClients,
  adminGetVisits,
  approveOrDeclineClient,
  clearAllNotifications,
  deleteNotification,
  fetchEmployeeProfilePhoto,
  getAdminDashboard,
  getNotifications,
  getProfile,
  getProfileImage
} from "@/app/backend-api/api";
import Dashcard from "@/app/components/Dashcard";
import AdminLocationTracker from "@/app/services/AdminTracker";
import styles from "@/app/stylesheet/globalstylesheet";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Btn from "../components/Btn";
import DashboardHeader from "../components/DashboardHeader";
import History from "../components/History";

type NotificationItem = {
  _id: string;
  message: string;
  time: string;
  date?: string;
  employeeEmail?: string;
  employeeName?: string;
  type?: string;
  profilePic?: string | null;
  clientData?: {
    name?: string;
    address?: string;
    clientNumber?: string;
    image?: { data: string; contentType: string };
  };
};

type EmployeeActivity = {
  name: string;
  email: string;
  type: string;
  clientName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  clockInTime?: string;
  clockOutTime?: string;
  profilePic?: string | null;
  date?: string;
};

function Dashboard() {
  const [config, setConfig] = useState<{
    success?: any;
    mapEnabled?: any;
    googleMapKey?: any;
  } | null>(null);

  const [activities, setActivities] = useState<EmployeeActivity[]>([]);
  const [profileData, setProfileData] = useState({ profilePic: "" });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [isRunning, setIsRunning] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<EmployeeActivity | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [selectedClient, setSelectedClient] = useState<NotificationItem | null>(
    null,
  );
  const [clientModalVisible, setClientModalVisible] = useState(false);

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayClockInCount, setTodayClockInCount] = useState(0);
  const [employeesOnLeave, setEmployeesOnLeave] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalTasksAllEmployees, setTotalTasksAllEmployees] = useState(0);
  const hasPostedLocation = useRef(false);

  // useEffect(() => {
  //   getMapConfig()
  //     .then(setConfig)
  //     .catch((err: any) => {
  //       console.error("❌ Error fetching map config:", err);
  //     });
  // }, []);

  /* ------------------ PROFILE ------------------ */
  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, []),
  );

  useEffect(() => {
    if (hasPostedLocation.current) return;

    hasPostedLocation.current = true;

    console.log("📍 Posting admin location ONCE");
    AdminLocationTracker.startTracking(); // this should POST ONCE internally
  }, []);

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

  /* ------------------ DASHBOARD ------------------ */
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
      fetchClientData();
      fetchNotifications();
      fetchTotalTasksAllEmployees();
    }, []),
  );

  const fetchClientData = async () => {
    try {
      const clients = await adminGetClients();
      setTotalClients(clients.totalClients || 0);
    } catch (err) {
      console.error("❌ Error fetching clients:", err);
      setTotalClients(0);
    }
  };

  const fetchTotalTasksAllEmployees = async () => {
    try {
      const data = await adminGetVisits(); // no employeeEmail = all employees
      setTotalTasksAllEmployees(data.totalVisits || 0); // use totalVisits field from backend
    } catch (err) {
      console.error("❌ Error fetching total tasks:", err);
      setTotalTasksAllEmployees(0);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const data = await getAdminDashboard();
      if (!data?.success) return;

      const total = data.totalEmployees || 0;
      const clockedIn = data.todayClockInCount || 0;

      setTotalEmployees(total);
      setTodayClockInCount(clockedIn);
      setEmployeesOnLeave(total - clockedIn);

      if (!Array.isArray(data.activities)) {
        setActivities([]);
        return;
      }

      /* ✅ FIX 1: USE YYYY-MM-DD (BACKEND FORMAT) */
      const today = new Date().toISOString().split("T")[0];

      const todayGroup = data.activities.find((g: any) => g._id === today);

      if (!todayGroup?.activities?.length) {
        setActivities([]);
        return;
      }

      const activities = todayGroup.activities;

      /* ✅ FIX 2: UNIQUE EMAILS */
      const uniqueEmails = [
        ...new Set(activities.map((a: any) => a.employeeEmail)),
      ];

      /* ✅ FIX 3: FETCH ALL PROFILE PHOTOS IN PARALLEL */
      const photoResults = await Promise.all(
        uniqueEmails.map(async (email) => ({
          email,
          photo: await fetchEmployeeProfilePhoto(email as any),
        })),
      );

      const photoMap: Record<string, string | null> = {};
      photoResults.forEach((p) => {
        photoMap[p.email as any] = p.photo || null;
      });

      /* ✅ FIX 4: BUILD FINAL ACTIVITY LIST */
      const finalActivities: EmployeeActivity[] = activities.map(
        (act: any) => ({
          name: act.employeeName,
          email: act.employeeEmail,
          profilePic: photoMap[act.employeeEmail] || null,
          type: act.type,
          clientName: act.clientName || "Unknown Client",
          checkInTime: act.clientCheckInTime || "",
          checkOutTime: act.clientCheckOutTime || "",
          clockInTime: act.clockInTime || "",
          clockOutTime: act.clockOutTime || "",
          date: today,
        }),
      );

      setActivities(finalActivities);
    } catch (err) {
      console.error("❌ Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ NOTIFICATIONS ------------------ */
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      if (data.success && Array.isArray(data.notifications)) {
        const updatedNotifications = await Promise.all(
          data.notifications.map(async (note: any) => {
            let profilePic = null;
            if (note.employeeEmail) {
              profilePic = await fetchEmployeeProfilePhoto(note.employeeEmail);
            }
            return { ...note, profilePic };
          }),
        );
        setNotifications(updatedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Error deleting notification:", err);
    }
  };

  const handleClearAll = async () => {
    Alert.alert("Confirm", "Clear all notifications?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: async () => {
          try {
            await clearAllNotifications();
            setNotifications([]);
          } catch (err) {
            console.error("❌ Error clearing notifications:", err);
          }
        },
      },
    ]);
  };

  const handleApproveDecline = async (action: "approve" | "decline") => {
    if (!selectedClient?._id) return;

    Alert.alert(
      `${action === "approve" ? "Approve" : "Decline"} Client`,
      `Are you sure you want to ${action} this client?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          onPress: async () => {
            try {
              const approved = action === "approve";
              const res = await approveOrDeclineClient(
                selectedClient._id,
                approved,
              );

              if (res.success) {
                setNotifications((prev) =>
                  prev.filter((n) => n._id !== selectedClient._id),
                );
              } else {
                Alert.alert("Error", res.message || "Something went wrong");
              }
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to process request");
            } finally {
              setClientModalVisible(false);
            }
          },
        },
      ],
    );
  };

  const openModal = (emp: EmployeeActivity) => {
    setSelectedEmp(emp);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEmp(null);
    setModalVisible(false);
  };

  const openClientModal = (note: NotificationItem) => {
    setSelectedClient(note);
    setClientModalVisible(true);
  };

  /* ------------------ UI ------------------ */
  return (
    <>
      <SafeAreaProvider style={styles.dashboardcontainer}>
        <DashboardHeader
          imageRefreshKey={imageRefreshKey}
          profileData={profileData}
          isRunning={isRunning}
          notifications={notifications}
          onBellPress={() => setNotificationModalVisible(true)}
          indicatorText={["Admin", "Admin"]}
        />

        <View style={[styles.dashboardframe, styles.gap]}>
          <View style={styles.rowitem}>
            <Dashcard
              title="Employees Total Count"
              number={totalEmployees}
              iconName="users"
              iconLibrary="FontAwesome5"
            />
            <Dashcard
              title="Employees on Leave"
              number={employeesOnLeave}
              iconName="users-slash"
              iconLibrary="FontAwesome5"
            />
          </View>

          <View style={styles.rowitem}>
            <Dashcard
              title="Total Task Assigned"
              number={totalTasksAllEmployees}
              iconName="fact-check"
              iconLibrary="MaterialIcons"
            />
            <Dashcard
              title="Total Client Count"
              number={totalClients}
              iconName="handshake"
              iconLibrary="FontAwesome5"
            />
          </View>

          <View style={styles.paddinghorizontal}>
            <Text style={styles.status}>Map Config Test</Text>
            <Text style={styles.color}>{JSON.stringify(config, null, 2)}</Text>
          </View>

          <Text style={[styles.status, styles.paddinghorizontal]}>
            Today’s Activity
          </Text>

          <ScrollView>
            <View style={[styles.gap, styles.marginBottom1]}>
              {activities.map((emp, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.avatarframe]}
                  onPress={() => openModal(emp)}
                >
                  <View style={styles.rowitem}>
                    <Image
                      source={
                        emp.profilePic
                          ? { uri: emp.profilePic }
                          : require("@/assets/images/profile.webp")
                      }
                      style={[styles.avatarheight, styles.empavatar]}
                    />
                    <View style={[styles.centeralign, styles.gap5]}>
                      <View>
                        <Text style={styles.status}>
                          {emp.name.replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Text>
                        <Text style={styles.color}>
                          {emp.type
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {activities.length === 0 && !loading && (
                <View style={[styles.centeralign, styles.margintop]}>
                  <Text style={[styles.locationtxt, styles.color]}>
                    No activity found today
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* 👤 Employee Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.clientbox}>
            <View style={[styles.clientframe, styles.gap]}>
              <View style={styles.rowitem}>
                <Image
                  source={
                    selectedEmp?.profilePic
                      ? { uri: selectedEmp.profilePic }
                      : require("@/assets/images/profile.webp")
                  }
                  style={[styles.employeeprofile]}
                />
                <View style={[styles.gap, styles.width60]}>
                  <Text style={[styles.status]}>
                    {selectedEmp?.name?.replace(/\b\w/g, (c) =>
                      c.toUpperCase(),
                    )}
                  </Text>
                  <Text style={[styles.plantxt, styles.color]}>
                    {selectedEmp?.type
                      ?.replace(/-/g, " ")
                      ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Text>
                </View>
              </View>

              {(selectedEmp?.type === "client-check-in" ||
                selectedEmp?.type === "client-check-out") &&
                selectedEmp?.clientName && (
                  <Text style={[styles.locationtxt]}>
                    Client Name : {selectedEmp.clientName}
                  </Text>
                )}
              {selectedEmp?.checkInTime && (
                <Text style={[styles.plantxt, styles.color]}>
                  Check In : {selectedEmp.checkInTime}
                </Text>
              )}
              {selectedEmp?.checkOutTime && (
                <Text style={[styles.plantxt, styles.color]}>
                  Check Out : {selectedEmp.checkOutTime}
                </Text>
              )}
              {selectedEmp?.clockInTime && (
                <Text style={[styles.plantxt, styles.color]}>
                  Clock In : {selectedEmp.clockInTime}
                </Text>
              )}
              {selectedEmp?.clockOutTime && (
                <Text style={[styles.plantxt, styles.color]}>
                  Clock Out : {selectedEmp.clockOutTime}
                </Text>
              )}
              {selectedEmp?.date && (
                <Text style={[styles.plantxt, styles.color]}>
                  Date : {selectedEmp.date}
                </Text>
              )}

              <Btn title="Back" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      </SafeAreaProvider>

      {/*------------------------------------------------ Full Screen Model --------------------------------------------------------- */}

      {/* 🔔 Notifications Modal */}
      <Modal
        visible={notificationModalVisible}
        animationType="slide"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <SafeAreaProvider style={styles.container}>
          <SafeAreaView style={styles.flex}>
            {/* ✅ FIX: Add GestureHandlerRootView inside Modal */}
            <GestureHandlerRootView style={styles.flex}>
              <View style={[styles.paddinghorizontal, styles.flex]}>
                <History
                  title="Notifications"
                  onPress={() => setNotificationModalVisible(false)}
                />

                {notifications.length > 0 ? (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.rightalign,
                        styles.paddinghorizontal,
                        styles.marginBottom1,
                      ]}
                      onPress={handleClearAll}
                    >
                      <Text style={[styles.locationtxt, styles.colorred]}>
                        Clear All
                      </Text>
                    </TouchableOpacity>

                    <FlatList
                      data={notifications}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item: note }) => {
                        const renderRightActions = () => (
                          <View>
                            <View
                              style={[
                                styles.centeralign,
                                styles.paddinghorizontal,
                                styles.flex,
                                styles.paddingbottom,
                              ]}
                            >
                              <View
                                style={[
                                  styles.bellicon,
                                  styles.centeralign,
                                  styles.iconframe,
                                ]}
                              >
                                <Ionicons name="trash" size={24} color="#fff" />
                              </View>
                            </View>
                          </View>
                        );

                        // ✅ Common notification content (used in both cases)
                        const NotificationCard = (
                          <View
                            style={[
                              styles.avatarframe,
                              styles.rowitem,
                              styles.marginBottom1,
                            ]}
                          >
                            <View style={styles.centeralign}>
                              <Image
                                source={
                                  note.profilePic
                                    ? { uri: note.profilePic }
                                    : require("@/assets/images/profile.webp")
                                }
                                style={[styles.avatarheight, styles.empavatar]}
                              />
                            </View>

                            <View>
                              {note.employeeName && (
                                <Text style={[styles.status]}>
                                  {note.employeeName.replace(/\b\w/g, (c) =>
                                    c.toUpperCase(),
                                  )}
                                </Text>
                              )}

                              <Text style={[styles.locationtxt, styles.color]}>
                                {note.type === "client-pending"
                                  ? "Client Request"
                                  : note.type
                                      ?.replace(/-/g, " ")
                                      .replace(/\b\w/g, (c) =>
                                        c.toUpperCase(),
                                      ) || note.message}
                              </Text>

                              <Text style={styles.color}>
                                {note.date} - {note.time}
                              </Text>
                            </View>

                            {note.type === "client-pending" && (
                              <View
                                style={[
                                  styles.centeralign,
                                  styles.rightalign,
                                  { width: 63 },
                                ]}
                              >
                                <Btn
                                  title="View"
                                  onPress={() => openClientModal(note)}
                                />
                              </View>
                            )}
                          </View>
                        );

                        // ✅ Disable swipe for client-pending only
                        if (note.type === "client-pending") {
                          return NotificationCard;
                        }

                        return (
                          <Swipeable
                            renderRightActions={renderRightActions}
                            onSwipeableOpen={() =>
                              handleDeleteNotification(note._id)
                            }
                            overshootRight={false}
                          >
                            {NotificationCard}
                          </Swipeable>
                        );
                      }}
                    />
                  </>
                ) : (
                  <View style={styles.centeralign}>
                    <Text style={[styles.locationtxt, styles.color]}>
                      No notifications yet.
                    </Text>
                  </View>
                )}
              </View>
            </GestureHandlerRootView>

            {/* 🧾 Client Modal */}
            <Modal
              visible={clientModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setClientModalVisible(false)}
            >
              <View style={styles.clientbox}>
                <View style={[styles.clientframe, styles.gap]}>
                  <Image
                    source={
                      selectedClient?.clientData?.image?.data
                        ? {
                            uri: `data:${selectedClient.clientData.image.contentType};base64,${selectedClient.clientData.image.data}`,
                          }
                        : require("@/assets/images/org.png")
                    }
                    style={styles.clientbanner}
                  />

                  <Text style={styles.status}>
                    Client Name :{" "}
                    {selectedClient?.clientData?.name || "Unknown Client"}
                  </Text>
                  <Text style={[styles.locationtxt, styles.color]}>
                    Address : {selectedClient?.clientData?.address || "N/A"}
                  </Text>
                  <Text style={[styles.locationtxt, styles.color]}>
                    Number : {selectedClient?.clientData?.clientNumber || "N/A"}
                  </Text>

                  <View style={styles.rowitem}>
                    <Btn
                      title="Approve"
                      onPress={() => handleApproveDecline("approve")}
                      style={styles.width48}
                    />
                    <Btn
                      title="Decline"
                      onPress={() => handleApproveDecline("decline")}
                      style={styles.width48}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </>
  );
}

export default Dashboard;
