// Track.tsx
import {
  adminAddEmployee, adminDeleteEmployee, adminGetEmployees, adminGetVisits,
  fetchEmployeeProfileMeta, fetchEmployeeProfilePhoto, fetchVisitImageBase64, getAdminDashboard,
  getAllLiveLocations, getEmployeeLiveLocation, getEmployeeLocationHistory,
} from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import History from "@/app/components/History";
import PageHeader from "@/app/components/PageHeader";
import Search from "@/app/components/Search";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InputBox from "../components/InputBox";
import socket from "../services/socket";
import styles from "../stylesheet/globalstylesheet";


type EmployeeActivity = {
  type?: string;
  clientName?: string;
  clientCheckInTime?: string;
  clientCheckOutTime?: string;
  clockInTime?: string;
  clockOutTime?: string;
  date?: string;
  employeeEmail?: string;
  employeeName?: string;
  status?: string;
  workedHours?: string;
};

type Employee = {
  name: string;
  email: string;
  mobile?: string;
  profilePic?: string | null;
  date?: string;
  clockInTime?: string;
  clockOutTime?: string;
  clientCheckInTime?: string;
  clientCheckOutTime?: string;
  status?: string;
  workedHours?: string;
  liveLat?: number;
  liveLng?: number;
};

type VisitType = {
  _id: string;
  taskName?: string;
  employeeEmail?: string;
  type?: string;
  notes?: string;
  status?: string;
  date?: string;
  profilePic?: string | null;
};

function Track() {
  const [searchText, setSearchText] = useState("");
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [addEmpModal, setAddEmpModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activities, setActivities] = useState<EmployeeActivity[]>([]);
  const [employeeMeta, setEmployeeMeta] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [locationHistory, setLocationHistory] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const statusButtonRef = useRef<React.ElementRef<typeof TouchableOpacity> | null>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const markerRefs = useRef<Record<string, any>>({});
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [groupedHistory, setGroupedHistory] = useState<Record<string, any[]>>({});
  const [visitImages, setVisitImages] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(0);
  const [addEmpLoading, setAddEmpLoading] = useState(false);
  const [employeeVisits, setEmployeeVisits] = useState<
    {
      _id: string;
      taskName: string;
      type?: string;
      notes?: string;
      status?: string;
      date?: string;
    }[]
  >([]);
  const [totalVisitCount, setTotalVisitCount] = useState(0);
  const [visits, setVisits] = useState<VisitType[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [completedVisits, setCompletedVisits] = useState(0);

  const [updateTick, setUpdateTick] = useState(0); const [liveLocationsMap, dispatchLocations] = React.useReducer(
    (state: Record<string, any>, action: { type: "update"; payload: { email: string; latitude: number; longitude: number; timestamp?: Date } }) => {
      switch (action.type) {
        case "update":
          return {
            ...state,
            [action.payload.email]: {
              latitude: action.payload.latitude,
              longitude: action.payload.longitude,
              updatedAt: action.payload.timestamp || new Date(),
            },
          };
        default:
          return state;
      }
    },
    {}
  );

  const statuses = ["All Status", "Active", "Inactive"];







 const fetchEmployeeVisits = async (
  empEmail: string,
  setEmployeeVisits: React.Dispatch<React.SetStateAction<any[]>>,
  setTotalVisitCount: React.Dispatch<React.SetStateAction<number>>,
  setVisitImages: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setCompletedVisitCount: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const data = await adminGetVisits(empEmail);

    // Show visit data immediately
    const visits = data.visits || [];
    setEmployeeVisits(visits);
    setTotalVisitCount(data.totalVisits || 0);
    setCompletedVisitCount(data.completed || 0);

    // Fetch all visit images in parallel
    await Promise.all(
      visits.map(async (visit :  any) => {
        if (visit._id) {
          try {
            const imgBase64 = await fetchVisitImageBase64(visit._id);
            if (imgBase64) {
              // Update state progressively
              setVisitImages((prev) => ({
                ...prev,
                [visit._id]: imgBase64,
              }));
            }
          } catch (err) {
            console.log(`⚠️ Error fetching image for visit ${visit._id}:`, err);
          }
        }
      })
    );
  } catch (err) {
    console.error("❌ Error fetching employee visits:", err);
    setEmployeeVisits([]);
    setTotalVisitCount(0);
    setCompletedVisitCount(0);
    setVisitImages({});
  }
};


  useEffect(() => {
    if (selectedEmployee?.email) {
      fetchEmployeeVisits(
        selectedEmployee.email,
        setEmployeeVisits,
        setTotalVisitCount,
        setVisitImages,
        setCompletedVisits  // must pass completed setter last
      );
    }
  }, [selectedEmployee]);



  const openModal = () => {
    statusButtonRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setModalPosition({ x: px, y: py });
      setDropdownVisible(true);
    });
  };





  const handleSelect = (status: string) => {
    setSelectedStatus(status);
    setDropdownVisible(false);
  };





  const storeClockInTime = async (email: string, time: string) => {
    try {
      const today = new Date().toLocaleDateString("en-GB");
      await AsyncStorage.setItem(`clockIn_${email}`, JSON.stringify({ time, date: today }));
    } catch (e) {
      console.error("❌ Error saving clock-in:", e);
    }
  };





  const getStoredClockInTime = async (email: string) => {
    try {
      const data = await AsyncStorage.getItem(`clockIn_${email}`);
      if (!data) return null;
      const parsed = JSON.parse(data);
      const today = new Date().toLocaleDateString("en-GB");
      if (parsed.date === today) return parsed.time;
      await AsyncStorage.removeItem(`clockIn_${email}`);
      return null;
    } catch (e) {
      console.error("❌ Error reading clock-in:", e);
      return null;
    }
  };





  const formatTime = (value?: string) => {
    if (!value) return "";
    if (/^\d{1,2}:\d{2}(\s?[APap][Mm])?$/.test(value)) return value;
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    return value;
  };





  // ----------------------------------- SOCKET SETUP ---------------------------------------------------------------------------------------------->

 useEffect(() => {
  console.log("📡 Socket listener attached (Track screen)");

  const handleLocationUpdate = (data: any) => {
    console.log("📍 Live update:", data);
    dispatchLocations({
      type: "update",
      payload: {
        email: data.employeeEmail,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      },
    });
  };

  socket.on("locationUpdate", handleLocationUpdate);

  return () => {
    console.log("🔌 Socket listener removed");
    socket.off("locationUpdate", handleLocationUpdate);
  };
}, []);





  //-------------------- Fetching Employee Location and History ----------------------------------------------------------------------------------->

  const fetchEmployeeLiveAndHistory = async (empEmail: string) => {
    try {
      const [live, history] = await Promise.all([
        getEmployeeLiveLocation(empEmail),
        getEmployeeLocationHistory(empEmail),
      ]);

      const grouped = (history || []).reduce((acc: Record<string, any[]>, loc: any) => {
        const date = new Date(loc.timestamp).toLocaleDateString("en-GB"); // convert to local date
        if (!acc[date]) acc[date] = [];
        acc[date].push(loc);
        return acc;
      }, {});
      setGroupedHistory(grouped);
      setLocationHistory(history || []);

      if (live?.latitude && live?.longitude) {
        dispatchLocations({
          type: "update",
          payload: {
            email: empEmail,
            latitude: live.latitude,
            longitude: live.longitude,
            timestamp: live.updatedAt || new Date(),
          },
        });
      }
    } catch (err) {
      console.error("❌ Error fetching live/history:", err);
    }


  };





  const openEmployeeModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setEmployeeModalVisible(true);
    fetchEmployeeLiveAndHistory(emp.email);

    fetchEmployeeVisits(
      emp.email,
      setEmployeeVisits,
      setTotalVisitCount,
      setVisitImages,
      setCompletedVisits  // ✅ pass completed setter
    );
  };






  // -------------------------- Status Filter ------------------------------------------------------------------------------------------------------->

  const filteredEmployees = employees.filter((emp) => {
    const matchStatus = selectedStatus === "All Status" || emp.status === selectedStatus;
    const matchName = emp.name?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchName;
  });





  const fetchEmployeesWithStatus = async (): Promise<void> => {
    setLoading(true);
    try {
      // 1️⃣ Always fetch employees first
      const empRes: any = await adminGetEmployees();
      if (!empRes || empRes.success === false) {
        Alert.alert("Error", empRes?.message || "Failed to load employees");
        setEmployees([]);
        return;
      }

      // 2️⃣ Fetch dashboard & live locations safely
      let dashData: any = null;
      let liveData: any = [];
      try {
        dashData = await getAdminDashboard().catch(() => null);
        liveData = await getAllLiveLocations().catch(() => []);
      } catch { }

      const formattedToday = new Date().toLocaleDateString("en-GB");
      const todayActivities: EmployeeActivity[] =
        dashData?.activities?.find((g: any) => g._id === formattedToday)?.activities || [];

      // 3️⃣ Map employees
      const enriched: Employee[] = await Promise.all(
        empRes.map(async (emp: any) => {
          const profilePic = await fetchEmployeeProfilePhoto(emp.email);
          const meta = await fetchEmployeeProfileMeta(emp.email);
          const mobile = meta?.mobile || "N/A";

          const empActivity: EmployeeActivity | undefined = todayActivities.find(
            (act: any) => act.employeeEmail === emp.email
          );

          const liveLoc = liveData.find((l: any) => l.employeeEmail === emp.email);

          // 4️⃣ Handle Clock-In
          let clockInTime = formatTime(empActivity?.clockInTime);
          if (clockInTime) await storeClockInTime(emp.email, clockInTime);
          else {
            const storedClockIn = await getStoredClockInTime(emp.email);
            if (storedClockIn) clockInTime = storedClockIn;
          }

          return {
            name: emp.name,
            email: emp.email,
            mobile,
            profilePic,
            date: empActivity?.clockInTime ? new Date(empActivity.clockInTime).toLocaleDateString("en-GB") : formattedToday,
            clockInTime,
            clockOutTime: formatTime(empActivity?.clockOutTime),
            clientCheckInTime: formatTime(empActivity?.clientCheckInTime),
            clientCheckOutTime: formatTime(empActivity?.clientCheckOutTime),
            status: empActivity?.status || "Inactive",
            liveLat: liveLoc?.latitude,
            liveLng: liveLoc?.longitude,
            workedHours: empActivity?.workedHours,

          };
        })
      );

      setEmployees(enriched);
      setActivities(todayActivities); // for worked hours display
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      Alert.alert("Error", "Something went wrong fetching employee data.");
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchEmployeesWithStatus();
    }, [])
  );

  const loadEmployeeMeta = async (email: string) => {
    const meta = await fetchEmployeeProfileMeta(email);
    setEmployeeMeta(meta);
  };





  // -------------------------- Add Employee ------------------------------------------------------------------------------------------------------->

  const handleAddEmployee = async () => {
    if (!name || !email || !password) {
      Alert.alert("❌ Error", "Please fill all fields");
      return;
    }
    const normalizedPassword = password.trim();
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;
    if (!strongPasswordRegex.test(normalizedPassword)) {
      Alert.alert(
        "❌ Weak Password",
        "Password must be at least 6 characters and include:\n- Uppercase letters\n- Lowercase letters\n- Numbers\n- Special characters (@ # & * .)"
      );
      return;
    }

    try {
      setAddEmpLoading(true);
      const res = await adminAddEmployee({
        name: name.trim(),
        email: email.trim(),
        password: normalizedPassword,
      });
      if (res.success) {
        Alert.alert("✅ Success", "Employee added successfully");
        setAddEmpModal(false);
        setName("");
        setEmail("");
        setPassword("");
        fetchEmployeesWithStatus();
      } else {
        Alert.alert("❌ Error", res.message || "Failed to add employee");
      }
    } catch (err) {
      console.error("❌ Error adding employee:", err);
      Alert.alert("❌ Error", "Failed to add employee");
    } finally {
      setAddEmpLoading(false);;
    }
  };





  // -------------------------- Delete Employee ---------------------------------------------------------------------------------------------------->

  const handleDeleteEmployee = (employeeEmail: string) => {
    Alert.alert("Delete Employee", "Are you sure you want to delete this employee?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            const res = await adminDeleteEmployee(employeeEmail);
            if (res.success) {
              fetchEmployeesWithStatus();
              setProfileModalVisible(false);
              setEmployeeModalVisible(false);
            } else {
              Alert.alert("Error", res.message || "Failed to delete employee");
            }
          } catch (err) {
            console.error("Error deleting employee:", err);
            Alert.alert("Error", "Failed to delete employee");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };





  // ---------------- EmployeeMap component for address lookup ------------------------------------------------------------------------------------->

  const EmployeeMap = ({
    employee,
    coordinates,
    groupedHistory,
    selectedDate,
  }: {
    employee: Employee;
    coordinates: { latitude: number; longitude: number };
    groupedHistory: Record<string, any[]>;
    selectedDate: string | null;
  }) => {
    const mapRef = useRef<MapView | null>(null);
    const [address, setAddress] = useState<string>("Fetching address...");

    const dailyCoords =
      selectedDate && groupedHistory[selectedDate]
        ? groupedHistory[selectedDate].map((loc) => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
        }))
        : [];

    // ✅ Reverse Geocoding with improved street fallback
    useEffect(() => {
      const getAddress = async () => {
        try {
          const geocode = await Location.reverseGeocodeAsync({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          });

          if (geocode && geocode.length > 0) {
            const loc = geocode[0];

            // 🏠 Construct full address with best available street data
            const streetParts = [
              loc.name,
              loc.street,
              loc.district,
              loc.subregion,
              loc.city,
            ].filter(Boolean);

            const streetLine =
              streetParts.length > 0
                ? streetParts.join(", ")
                : "Street details unavailable";

            const fullAddress = `${streetLine}, ${loc.region || ""}, ${loc.country || ""
              } ${loc.postalCode ? "- " + loc.postalCode : ""}`;

            setAddress(fullAddress.trim());
          } else {
            setAddress("Address not found");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setAddress("Unable to fetch address");
        }
      };

      getAddress();
    }, [coordinates]);

    // ✅ Function to recenter map to employee location
    const centerToEmployee = () => {
      if (mapRef.current) {
        let target;

        if (selectedDate && dailyCoords.length > 0) {
          // 📅 History mode — center on last location of that date
          target = dailyCoords[dailyCoords.length - 1];
        } else {
          // 📍 Live mode — center on current live location
          target = coordinates;
        }

        mapRef.current.animateToRegion(
          {
            latitude: target.latitude,
            longitude: target.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    };

    // 🗓️ Auto-center map when switching to history mode
    useEffect(() => {
      if (mapRef.current) {
        if (selectedDate && dailyCoords.length > 0) {
          // Move to last history point
          const last = dailyCoords[dailyCoords.length - 1];
          mapRef.current.animateToRegion(
            {
              latitude: last.latitude,
              longitude: last.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
        } else {
          // Move back to live location when history is cleared
          mapRef.current.animateToRegion(
            {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
        }
      }
    }, [selectedDate, dailyCoords, coordinates]);



    return (
      <View>
        {/* 🗺️ Map Section */}
        <View style={styles.map}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* 📍 Employee Marker */}
            <Marker
              coordinate={
                selectedDate && dailyCoords.length > 0
                  ? dailyCoords[dailyCoords.length - 1] // last point from selected date
                  : {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                  }
              }
              title={
                selectedDate
                  ? `${employee.name} (${selectedDate})`
                  : `${employee.name} (Live)`
              }
            />

            {/* 🛣️ Polyline for selected date */}
            {dailyCoords.length > 1 && (
              <Polyline
                coordinates={dailyCoords}
                strokeColor="#007AFF"
                strokeWidth={4}
              />
            )}
          </MapView>

          {/* 🎯 Floating Center Button */}
          <TouchableOpacity onPress={centerToEmployee} style={styles.locationicon}>
            <Ionicons name="location-sharp" size={28} color="rgba(232, 0, 0, 1)" />
          </TouchableOpacity>
        </View>

        {/* 🏠 Address Section (Separate from map) */}
        <View style={styles.padding15}>
          <Text style={[styles.locationtxt, styles.color]}>
            {address}
          </Text>
        </View>
      </View>
    );
  };





  return (
    <>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.flex}>
          <View style={[styles.paddinghorizontal, styles.flex]}>
            <PageHeader title="Employees List" />

{/*------------------------ Search + Status Filter --------------------------------------------------------------------------------------------->*/}

            <View style={styles.row}>
              <View style={styles.flex}>
                <Search
                  searchText={searchText}
                  setSearchText={setSearchText}
                  placeholder="Search emp" />
              </View>

              <View style={[styles.searchcard, styles.h60, { width: "45%" }]}>
                <TouchableOpacity ref={statusButtonRef} onPress={openModal} style={{ paddingHorizontal: 5 }}>
                  <View style={[styles.row]}>
                    <Text style={[styles.text, styles.color, { marginTop: 3 }]}>{selectedStatus}</Text>
                    <View style={styles.centeralign}>
                      <Ionicons name="caret-down" size={30} color="#646464" />
                    </View>
                  </View>
                </TouchableOpacity>

                <Modal visible={dropdownVisible} transparent onRequestClose={() => setDropdownVisible(false)}>
                  <TouchableOpacity onPressOut={() => setDropdownVisible(false)}>
                    <View style={[styles.searchcard,
                    { top: modalPosition.y - -55, left: modalPosition.x - 12, width: "42%", height: 150, gap: 15, paddingHorizontal: 15 },
                    ]}
                    >
                      {statuses.map((status) => (
                        <TouchableOpacity key={status} style={styles.rowitem} onPress={() => handleSelect(status)}>
                          <Text style={[styles.text, styles.color]}>{status}</Text>
                          {selectedStatus === status && <MaterialIcons name="check-circle" size={24} color="#646464" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            </View>

{/*---------------------------------------------------- Employee List ---------------------------------------------------------*/}

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
              {filteredEmployees.length === 0 ? (
                <View style={styles.centeralign}>
                  <Text style={[styles.locationtxt, styles.color, styles.margintop]}>No employees found</Text>
                </View>
              ) : (
                filteredEmployees.map((emp) => (
                  <TouchableOpacity key={emp.email} onPress={() => openEmployeeModal(emp)}>
                    <View style={[styles.avatarframe, styles.marginBottom1]}>
                      <View style={[styles.rowitem, styles.centeralign]}>
                        <Image
                          source={emp.profilePic ? { uri: emp.profilePic } : require("../../assets/images/profile.webp")}
                          style={[styles.avatarheight, styles.empavatar]}
                        />
                        <View style={[styles.gap5, styles.width48]}>
                          <Text style={[styles.status]}>{emp.name}</Text>
                          {emp.clockInTime && <Text>Clock-in at {emp.clockInTime}</Text>}
                          {emp.clockOutTime && <Text>Clock-out at {emp.clockOutTime}</Text>}
                          {emp.clientCheckInTime && <Text>Last update at {emp.clientCheckInTime}</Text>}
                          {emp.clientCheckOutTime && <Text>Last update at {emp.clientCheckOutTime}</Text>}
                        </View>
                        <View style={[styles.rightalign, styles.centeralign]}>
                          <Text style={[styles.locationtxt, { color: emp.status === "Active" ? "rgba(8, 143, 8, 1)" : "#e45d5dff" }]}>
                            {emp.status || "Inactive"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

{/*--------------------------------- Floating Add Button --------------------------------------------------------------------->*/}

            <TouchableOpacity onPress={() => setAddEmpModal(true)} style={styles.floatingaddicon}>
              <Image source={require("../../assets/images/add-icon.png")} style={styles.bellicon} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>





{/*-------------------------------------------------- Full Screen Models ------------------------------------------------------*/}





{/*-------------------------------------------------- Add Employee Modal ------------------------------------------------------*/}

      <Modal visible={addEmpModal} onRequestClose={() => setAddEmpModal(false)}>
        <SafeAreaProvider style={styles.container}>
          <SafeAreaView style={styles.flex}>
            <View style={[styles.paddinghorizontal, styles.flex]}>
              <History title="Add Employee" onPress={() => setAddEmpModal(false)} />
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} style={styles.flex}
              >
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
                  <View style={[styles.gap, styles.width100, styles.marginBottom1]}>
                    <Image source={require("../../assets/images/emp.png")} style={styles.image}/>

                    <InputBox
                      placeholder="Enter employee name"
                      value={name}
                      setValue={setName}
                      icon="person"
                      autoCapitalize="words"
                    />

                    <InputBox
                      placeholder="Enter employee email"
                      keyboardType="email-address"
                      value={email}
                      setValue={setEmail}
                      icon="mail"
                      autoCapitalize="none"
                    />

                    <InputBox
                      placeholder="Create password"
                      secureTextEntry
                      value={password}
                      setValue={setPassword}
                      icon="lock-closed"
                      autoCapitalize="sentences"
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
            <View style={[styles.paddinghorizontal, styles.gap, { marginBottom: 15 }]}>
              <Btn title={addEmpLoading ? "Saving..." : "Add Employee"} onPress={handleAddEmployee} disabled={addEmpLoading} />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>





{/*-------------------------------------------------- Live Tracking Model -----------------------------------------------------*/}

      {selectedEmployee && (
        <Modal visible={employeeModalVisible} onRequestClose={() => setEmployeeModalVisible(false)}>
          <SafeAreaProvider style={styles.container}>
            <SafeAreaView style={styles.flex}>
              <View style={[styles.paddinghorizontal, styles.flex]}>
                <History title="Live Tracking" onPress={() => setEmployeeModalVisible(false)} />
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                  <TouchableOpacity onPress={() => { setProfileModalVisible(true); loadEmployeeMeta(selectedEmployee.email) }}>
                    <View style={[styles.avatarframe]}>
                      <View style={[styles.rowitem, styles.centeralign]}>
                        <Image
                          source={selectedEmployee.profilePic ? { uri: selectedEmployee.profilePic } : require("../../assets/images/profile.webp")}
                          style={[styles.avatarheight, styles.empavatar]}
                        />
                        <View style={[styles.gap5, styles.width48]}>
                          <Text style={[styles.status]}>{selectedEmployee.name}</Text>
                          {selectedEmployee.clockInTime && <Text>Clock-in at {selectedEmployee.clockInTime}</Text>}
                          {selectedEmployee.clockOutTime && <Text>Clock-out at {selectedEmployee.clockOutTime}</Text>}
                          {selectedEmployee.clientCheckInTime && <Text>Last update at {selectedEmployee.clientCheckInTime}</Text>}
                          {selectedEmployee.clientCheckOutTime && <Text>Last update at {selectedEmployee.clientCheckOutTime}</Text>}
                        </View>
                        <View style={[styles.rightalign, styles.centeralign]}>
                          <Text style={[styles.locationtxt, { color: selectedEmployee.status === "Active" ? "rgba(8, 143, 8, 1)" : "#e45d5dff" }]}>
                            {selectedEmployee.status || "Inactive"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.margintop}>
                    {liveLocationsMap[selectedEmployee.email] ? (
                      <View style={styles.gap}>
                        <TouchableOpacity style={[styles.searchcard, styles.centeralign, styles.h50]}
                          onPress={() => setHistoryModalVisible(true)}
                        >
                          <Text style={[styles.locationtxt]}>Live and History</Text>
                        </TouchableOpacity>

                        <EmployeeMap
                          employee={selectedEmployee}
                          coordinates={{
                            latitude: liveLocationsMap[selectedEmployee.email].latitude,
                            longitude: liveLocationsMap[selectedEmployee.email].longitude,
                          }}
                          groupedHistory={groupedHistory}
                          selectedDate={selectedDate}
                        />
                      </View>
                    ) : (
                      <View style={[styles.centeralign, styles.marginBottom1]}>
                        <Text style={[styles.locationtxt, styles.color, styles.margintop]}>No live location available</Text>
                      </View>
                    )}

                    <View style={styles.gap}>
                      <Text style={[styles.status, { left: 15 }]}>Total Visits ({totalVisitCount})</Text>
                      {employeeVisits.length > 0 ? (
                        <FlatList
                          data={employeeVisits}
                          keyExtractor={(item) => item._id}
                          scrollEnabled={false}
                          renderItem={({ item }) => (
                            <View style={[styles.rowitem, styles.avatarframe, styles.centeralign, styles.marginBottom1]}>
                              {/* Visit Image */}
                              <Image source={visitImages[item._id]
                                ? { uri: visitImages[item._id] }
                                : require("@/assets/images/profile.webp")
                              } style={[styles.avatarheight, styles.empavatar]}
                                resizeMode="cover"
                              />

                              {/* Visit Info */}
                              <View style={[styles.flex]}>
                                <Text style={[styles.status, styles.width65]}>{item.taskName}</Text>
                                <Text style={[styles.locationtxt, styles.color]}>{item.type}</Text>
                                <Text style={styles.color}>{item.notes}</Text>
                                <View style={[styles.statusbg, { backgroundColor: item.status === "completed" ? "#ebfff1ff" : "#ffedeeff" }]}>
                                  <Text style={{ color: item.status === "completed" ? "rgba(0, 147, 0, 1)" : "rgba(162, 0, 0, 1)", fontWeight: "500", bottom: 1 }}>
                                    {item.status}
                                  </Text>
                                </View>
                                <Text style={[styles.rightalign, styles.color]}>{item.date}</Text>
                              </View>
                            </View>
                          )}
                        />
                      ) : (
                        <View style={styles.centeralign}>
                          <Text style={[styles.locationtxt, styles.color, styles.margintop]}>No visits available</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>





{/*---------------------- Profile Modal ------------------------------------------------------------------------------------------------------->*/}

              {selectedEmployee && (
                <Modal visible={profileModalVisible} transparent onRequestClose={() => setProfileModalVisible(false)}>
                  <View style={[styles.employeecard, styles.centeralign, styles.width100]}>
                    <View style={[styles.statusframe, styles.gap, styles.width100]}>
                      <View style={[styles.rowitem]}>
                        <Image source={selectedEmployee.profilePic ? { uri: selectedEmployee.profilePic } : require("../../assets/images/profile.webp")
                        } style={[styles.employeeprofile]}
                        />
                        <View style={[styles.gap, styles.padding10]}>
                          <Text style={[styles.status]}>{selectedEmployee.name}</Text>
                          <Text style={[styles.locationtxt,
                          { color: selectedEmployee.status === "Active" ? "rgba(8, 143, 8, 1)" : "#e45d5dff" }]}
                          >
                            {selectedEmployee.status || "Inactive"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.rowitem}>
                        <Text style={styles.locationtxt}>Mobile :</Text>
                        <Text style={[styles.locationtxt, styles.rightalign]}>{employeeMeta?.mobile || "N/A"}</Text>
                      </View>

                      <View style={styles.rowitem}>
                        <Text style={styles.locationtxt}>Mail :</Text>
                        <Text style={[styles.locationtxt, styles.rightalign]}>
                          {selectedEmployee?.email || "Not found"}
                        </Text>
                      </View>

                      <View style={styles.rowitem}>
                        <Text style={styles.locationtxt}>Clock In :</Text>
                        <Text style={[styles.locationtxt, styles.rightalign]}>
                          {selectedEmployee.clockInTime || " Not yet"}
                        </Text>
                      </View>

                      <View style={styles.rowitem}>
                        <Text style={styles.locationtxt}>Clock Out :</Text>
                        <Text style={[styles.locationtxt, styles.rightalign]}>
                          {selectedEmployee.clockOutTime || "Not yet"}
                        </Text>
                      </View>

                      <View style={styles.rowitem}>
                        <Text style={styles.locationtxt}>Worked Hours :</Text>
                        <Text style={[styles.locationtxt, styles.rightalign]}>
                          {selectedEmployee.workedHours || "Calculating ..."}
                        </Text>
                      </View>

                      <View style={styles.rowitem}>
                        <Text style={styles.locationtxt}>Total Tasks :</Text>
                        <Text style={[styles.locationtxt, styles.rightalign]}>
                          {totalVisitCount}
                        </Text>
                      </View>

                      <View style={styles.rowitem}>
                        <Text style={styles.locationtxt}>Completed Tasks :</Text>
                        <Text style={[styles.locationtxt, styles.rightalign]}>
                          {completedVisits}
                        </Text>
                      </View>

                      <Btn
                        title={deleting ? "Deleting..." : "Delete Employee"}
                        onPress={() => handleDeleteEmployee(selectedEmployee.email)}
                        disabled={deleting}
                      />
                      {/* ❌ Close Button */}
                      <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={[styles.cross]}>
                        <Ionicons name="close" size={35} color={"#fff"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}





{/*------------------------------------- 📅 History Date Modal ----------------------------------------------------------------*/}

              <Modal visible={historyModalVisible} transparent onRequestClose={() => setHistoryModalVisible(false)} >
                <View style={[styles.employeecard, styles.centeralign, styles.width100]}>
                  <View style={[styles.statusframe, styles.gap, styles.width100, { maxHeight: 350, minHeight: 350 }]}>
                    <Text style={[styles.status]}>Select Date</Text>

                    <ScrollView>
                      {/* 🟢 Go to Live Location Option */}
                      <TouchableOpacity style={[styles.rowitem, styles.paddinghorizontal, styles.marginVertical]}
                        onPress={() => { setSelectedDate(null); setHistoryModalVisible(false); }}>
                        <Text style={[styles.locationtxt, { color: "rgba(8,143,8,1)" }]}>
                          Go to Live Location
                        </Text>

                        {selectedDate === null && (
                          <MaterialIcons name="check-circle" size={26} color="#4CAF50" style={[styles.rightalign]} />
                        )}
                      </TouchableOpacity>

                      {/* 📜 Date History List */}
                      {Object.keys(groupedHistory).length > 0 ? (
                        Object.keys(groupedHistory)
                          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                          .map((date) => (
                            <TouchableOpacity key={date} style={[styles.rowitem, styles.paddinghorizontal, styles.marginVertical]}
                              onPress={() => { setSelectedDate(date); setHistoryModalVisible(false); }}>
                              <Text style={[styles.locationtxt, styles.color]}>{date}</Text>

                              {selectedDate === date && (
                                <MaterialIcons name="check-circle" size={26} color="#888" style={styles.rightalign} />
                              )}
                            </TouchableOpacity>
                          ))
                      ) : (
                        <View style={[styles.centeralign]}>
                          <Text style={[styles.locationtxt, styles.color]}>No history available</Text>
                        </View>
                      )}
                    </ScrollView>

                    {/* ❌ Close Button */}
                    <TouchableOpacity onPress={() => setHistoryModalVisible(false)} style={[styles.cross]}>
                      <Ionicons name="close" size={35} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

            </SafeAreaView>
          </SafeAreaProvider>
        </Modal>
      )}
    </>
  );
}

export default Track;