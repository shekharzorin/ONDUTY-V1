import {
  fetchReportImageBase64,
  getReports,
  postReport,
  updateReport,
} from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import History from "@/app/components/History";
import ImagePickerComponent from "@/app/components/ImagePicker";
import InputBox from "@/app/components/InputBox";
import Search from "@/app/components/Search";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";
import styles from "../stylesheet/globalstylesheet";

export default function Report({ route }: any) {
  const clientNameFromMap = route?.params?.clientName || "";
  const [clientName, setClientName] = useState(clientNameFromMap);
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [reportImageUri, setReportImageUri] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [reportImages, setReportImages] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState("");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  // ---------------- FETCH REPORTS ----------------
  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);

      const imgs: Record<string, string> = {};

      for (const r of data) {
        if (!r._id) continue;

        try {
          const img = await fetchReportImageBase64(r._id);
          if (img) imgs[r._id] = img;
        } catch {}
      }

      setReportImages(imgs);
    } catch (error) {
      Alert.alert("❌ Error", "Unable to fetch reports");
    }
  };

  // Prevent multiple fetch loops
  useEffect(() => {
    if (isFocused && !modalVisible) {
      fetchReports();
    }
  }, [isFocused, modalVisible]);

  // ---------------- ADD / UPDATE REPORT ----------------
  const handleSubmit = async () => {
    if (!clientName.trim() || !purpose.trim() || !notes.trim())
      return Alert.alert("❌ Error", "Please fill all fields.");

    try {
      setLoading(true);

      if (editingReportId) {
        await updateReport(editingReportId, {
          clientName,
          purpose,
          notes,
          imageUri: reportImageUri,
        });
        Alert.alert("✅ Updated", "Report updated successfully.");
      } else {
        await postReport({
          clientName,
          purpose,
          notes,
          imageUri: reportImageUri,
        });
        Alert.alert("✅ Added", "Report added successfully.");
      }

      resetForm();
      setTimeout(fetchReports, 400);
    } catch (error: any) {
      Alert.alert(
        "❌ Error",
        error?.response?.data?.message || "Failed to save report."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName(clientNameFromMap);
    setPurpose("");
    setNotes("");
    setReportImageUri(null);
    setEditingReportId(null);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    resetForm();
  };

  // ---------------- EDIT REPORT ----------------
  const handleEditReport = async (report: any) => {
    setClientName(report.clientName);
    setPurpose(report.purpose);
    setNotes(report.notes);
    setEditingReportId(report._id);
    setModalVisible(true);

    try {
      const img = await fetchReportImageBase64(report._id);
      setReportImageUri(img || null);
    } catch {
      setReportImageUri(null);
    }
  };

  // ---------------- FILTER SEARCH ----------------
  const filteredReports = reports.filter(
    (r) =>
      r.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      r.purpose.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
    <>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.flex}>
          <View style={[styles.paddinghorizontal, styles.flex]}>
            <PageHeader title="Reports" />


            <Search
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder="Search Reports by Client..."
            />

            <FlatList
              data={filteredReports}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.avatarframe, styles.marginBottom1]} onPress={() => setSelectedReport(item)}>
                  <View style={[styles.rowitem, styles.flex]}>
                    <View style={styles.centeralign}>
                      <Image source={reportImages[item._id]
                        ? { uri: reportImages[item._id] }
                        : require("@/assets/images/org.png")
                      } style={[styles.avatarheight, styles.empavatar]}
                      />
                    </View>
                    <View style={[styles.gap5, { justifyContent: "center", width: '75%' }]}>
                      <Text style={[styles.status]}>{item.clientName}</Text>
                      <Text>{item.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={[styles.centeralign, styles.margintop]}>
                  <Text style={[styles.locationtxt, styles.color]}>No reports found</Text>
                </View>
              )}
            />
          </View>

          {/* 🔹 Report Detail Modal */}
          <Modal visible={!!selectedReport} transparent onRequestClose={() => setSelectedReport(null)}>
            <View style={[styles.employeecard, styles.centeralign]}>
              {selectedReport && (
                <View style={[styles.statusframe, styles.gap, styles.width100]} >
                  <Text style={[styles.status]}>
                    Client : {selectedReport.clientName}
                  </Text>
                  <Text style={[styles.plantxt, styles.color]}>
                    Purpose : {selectedReport.purpose}
                  </Text>
                  <Text style={[styles.plantxt, styles.color]}>
                    Notes : {selectedReport.notes}
                  </Text>
                  <Text style={[styles.plantxt, styles.color]}>
                    Date : {selectedReport.date}
                  </Text>

                  <View style={[styles.rowitem, styles.centeralign]}>
                    {reportImages[selectedReport._id] && (
                      <TouchableOpacity onPress={() => { setSelectedImageUri(reportImages[selectedReport._id]); setImageModalVisible(true) }}>
                        <Image source={{ uri: reportImages[selectedReport._id] }} resizeMode="cover"
                          style={[styles.avatarheight, styles.empavatar]}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => { setSelectedReport(null); handleEditReport(selectedReport) }} style={[styles.rightalign]}>
                      <View style={[styles.bellicon, styles.centeralign, styles.iconframe]}>
                        <MaterialCommunityIcons name="square-edit-outline" size={28} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => setSelectedReport(null)} style={[styles.cross]}>
                    <Ionicons name="close" size={35} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>

          {/* 🖼️ Full Image Modal */}
          <Modal visible={imageModalVisible} onRequestClose={() => setImageModalVisible(false)}>
            <View style={[styles.flex, { backgroundColor: "#000" }]}>
              <Image source={{ uri: selectedImageUri || "" }}
                style={[styles.flex, { resizeMode: "contain" }]}
              />
              <TouchableOpacity onPress={() => setImageModalVisible(false)} style={[styles.cross]}>
                <Ionicons name="close" size={35} color="#fff" />
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Floating Add Button */}
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.floatingaddicon}>
            <Image source={require("../../assets/images/add-icon.png")} style={styles.bellicon} />
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>





{/*--------------------------------------- Add / Edit Report Modal -------------------------------------------------------------*/}

      <Modal visible={modalVisible} onRequestClose={() => handleCloseModal()}>
        <SafeAreaProvider style={styles.container}>
          <SafeAreaView style={styles.flex}>
            <View style={[styles.paddinghorizontal, styles.flex]}>
              <History title={editingReportId ? "Edit Report" : "Add Report"} onPress={() => handleCloseModal()}/>

              <ScrollView>
                <View style={[styles.gap, styles.marginBottom1]}>
                  <InputBox
                    placeholder="Client Name"
                    value={clientName}
                    setValue={setClientName}
                    autoCapitalize="words"
                  />
                  <InputBox
                    placeholder="Purpose"
                    value={purpose}
                    setValue={setPurpose}
                    autoCapitalize="sentences"
                  />
                  <View style={styles.box}>
                    <TextInput
                      placeholder="Notes..."
                      placeholderTextColor="#646464"
                      style={[styles.text, { height: 200 }]}
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      value={notes}
                      onChangeText={setNotes}
                    />
                  </View>
                  <ImagePickerComponent onImageSelect={setReportImageUri} />
                </View>
              </ScrollView>

              <View style={[styles.mtop, styles.marginBottom1]}>
                <Btn title={ loading? "Saving...": editingReportId? "Update Report": "Submit Report"}
                  onPress={handleSubmit}
                  disabled={loading}
                />
              </View>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </>
  );
}
