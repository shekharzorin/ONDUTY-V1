import { adminDeleteReport, adminGetReports, fetchEmployeeProfilePhoto, fetchReportImageBase64 } from "@/app/backend-api/api";
import PageHeader from "@/app/components/PageHeader";
import Search from "@/app/components/Search";
import styles from "@/app/stylesheet/globalstylesheet";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type ReportType = {
  _id: string;
  clientName: string;
  purpose: string;
  notes: string;
  employeeEmail?: string;
  employeeName?: string;
  date: string;
  profilePic?: string | null;
};

const Reports = () => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [reportImages, setReportImages] = useState<Record<string, string>>({}); // ✅ store report images
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH REPORTS ----------------
  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await adminGetReports();

      if (data && Array.isArray(data)) {
        // 👇 Get employee profile photos
        const updatedReports = await Promise.all(
          data.map(async (report: any) => {
            let profilePic = null;
            if (report.employeeEmail) {
              try {
                profilePic = await fetchEmployeeProfilePhoto(report.employeeEmail);
              } catch {
                console.log(`⚠️ No profile photo for ${report.employeeEmail}`);
              }
            }
            return { ...report, profilePic };
          })
        );

        setReports(updatedReports);

        // 👇 Fetch report images
        const images: Record<string, string> = {};
        for (const report of updatedReports) {
          if (report._id) {
            try {
              const img = await fetchReportImageBase64(report._id);
              if (img) images[report._id] = img;
            } catch {
              console.log(`⚠️ No image for report ${report._id}`);
            }
          }
        }
        setReportImages(images);
      }
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      Alert.alert("Error", "Unable to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  // 👇 Fetch data automatically when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  // ---------------- DELETE REPORT ----------------
  const handleDelete = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this report?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminDeleteReport(id);
            Alert.alert("✅ Deleted", "Report deleted successfully.");
            setSelectedReport(null);
            fetchReports();
          } catch (err: any) {
            console.error("Error deleting report:", err);
            Alert.alert(
              "❌ Error",
              err?.response?.data?.message || "Failed to delete report."
            );
          }
        },
      },
    ]);
  };

  // ---------------- FILTER SEARCH ----------------
  const filteredReports = reports.filter((report) =>
    (report.employeeName?.toLowerCase().includes(searchText.toLowerCase()) ||
    report.clientName?.toLowerCase().includes(searchText.toLowerCase()))
  );


  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.paddinghorizontal, styles.flex]}>
          <PageHeader title="Reports" />
          <Search
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder="Search by employee or client "
          />

          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.avatarframe, styles.marginBottom1]} onPress={() => setSelectedReport(item)}>
                <View style={[styles.rowitem, styles.flex]}>
                  <View style={styles.centeralign}>
                    <Image source={ item.profilePic
                          ? { uri: item.profilePic }
                          : require("@/assets/images/profile.webp")
                      } style={[styles.avatarheight, styles.empavatar]}
                    />
                  </View>
                  <View style={[styles.gap5, { justifyContent: "center"}]}>
                    <Text style={[styles.status]}>{item.employeeName}</Text>
                    <Text style={[styles.status, styles.color]}>Client : {item.clientName}</Text>
                    <Text style={styles.color}>{item.date}</Text>
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
        <Modal visible={!!selectedReport} transparent animationType="fade" onRequestClose={() => setSelectedReport(null)}>
          <View style={[styles.employeecard, styles.centeralign, styles.width100 ]}>
            {selectedReport && (
              <View style={[styles.statusframe, styles.gap, styles.width100 ]}>
                <TouchableOpacity onPress={() => setSelectedReport(null)} style={[styles.cross]}>
                  <Ionicons name="close" size={35} color="#fff" />
                </TouchableOpacity>
                {/* 👤 Employee Profile Photo */}
                <Image source={ selectedReport.profilePic
                      ? { uri: selectedReport.profilePic }
                      : require("@/assets/images/profile.webp")
                  }style={[styles.employeeprofile]}
                />

                <Text style={[styles.status]}>Client : {selectedReport.clientName}</Text>
                <Text style={[styles.plantxt, styles.color ]}>Uploaded by : {selectedReport.employeeName}</Text>
                <Text style={[styles.plantxt, styles.color ]}>Purpose : {selectedReport.purpose}</Text>
                <Text style={[styles.plantxt, styles.color ]}>Notes : {selectedReport.notes}</Text>
                <Text style={[styles.plantxt, styles.color ]}>Date : {selectedReport.date}</Text>

                <View style={[styles.rowitem, styles.centeralign]}>
                  {/* 🖼️ Report Image (from /report/image/:id) */}
                  {reportImages[selectedReport._id] && (
                    <TouchableOpacity onPress={() => { setSelectedImageUri(reportImages[selectedReport._id]); setImageModalVisible(true)}}>
                      <Image source={{ uri: reportImages[selectedReport._id] }}
                        style={[styles.avatarheight, styles.empavatar]}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}

                  {/* 🗑️ Delete Button */}
                  <TouchableOpacity onPress={() => handleDelete(selectedReport._id)} style={styles.rightalign}>
                    <View style={[ styles.bellicon, styles.centeralign,styles.iconframe]}>
                        <Ionicons name="trash" size={24} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>

        {/* 🖼️ Fullscreen Image Modal */}
        <Modal visible={imageModalVisible} onRequestClose={() => setImageModalVisible(false)}>
          <View style={[styles.flex, { backgroundColor: '#000' }]}>
            <Image source={{ uri: selectedImageUri || "" }}
              style={[styles.flex, { resizeMode: 'contain' }]}
            />
              <TouchableOpacity onPress={() => setImageModalVisible(false)} style={[styles.cross]}>
                <Ionicons name="close" size={35} color="#fff" />
              </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Reports;