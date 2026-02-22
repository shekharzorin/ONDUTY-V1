import { deleteVisit, fetchVisitImageBase64, getVisits, postVisit, updateVisit } from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import History from "@/app/components/History";
import ImagePickerComponent from "@/app/components/ImagePicker";
import InputBox from "@/app/components/InputBox";
import PageHeader from "@/app/components/PageHeader";
import Search from "@/app/components/Search";
import styles from "@/app/stylesheet/globalstylesheet";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Visits() {
  const isFocused = useIsFocused();
  const [visits, setVisits] = useState<any[]>([]);
  const [visitImages, setVisitImages] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editType, setEditType] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState(new Date());
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPickerVisible, setEditPickerVisible] = useState(false);
  const [editImageUri, setEditImageUri] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const statusOptions = ["pending", "reschedule", "completed"];

  // ------------------- Load Visits -------------------
  const loadVisits = async () => {
    try {
      const data = await getVisits();
      if (data?.visits) {
        setVisits([...data.visits]);

        // fetch images for visits
        const images: Record<string, string> = {};
        for (const visit of data.visits) {
          if (visit._id) {
            try {
              const img = await fetchVisitImageBase64(visit._id);
              if (img) images[visit._id] = img;
            } catch {
              // ignore missing images
            }
          }
        }
        setVisitImages(images);
      } else {
        setVisits([]);
        setVisitImages({});
      }
    } catch (err) {
      console.log("Error loading visits:", err);
      Alert.alert("Error ❌", "Failed to fetch visits from server.");
    }
  };

  useEffect(() => {
    if (isFocused) loadVisits();
  }, [isFocused]);

  // ------------------- Add Visit -------------------
  const handleSave = async () => {
    if (!taskName.trim() || !type.trim() || !notes.trim()) {
      return Alert.alert("❌ Error", "Please fill all the fields");
    }

    const newVisit = {
      taskName,
      type,
      notes,
      status: "Pending",
      date: date.toDateString(),
      imageUri,
    };

    try {
      setLoading(true);
      await postVisit(newVisit);

      // reset form
      setModalVisible(false);
      setTaskName("");
      setType("");
      setNotes("");
      setDate(new Date());
      setImageUri(null);

      setTimeout(() => loadVisits(), 500);
      Alert.alert("✅ Success", "Visit saved successfully!");
    } catch (err) {
      console.log("Error saving visit:", err);
      Alert.alert("Error ❌", "Failed to save visit.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Edit Visit -------------------
  const editVisit = async (visit: any) => {
    setSelectedVisitId(visit._id);
    setEditTaskName(visit.taskName || "");
    setEditType(visit.type || "");
    setEditNotes(visit.notes || "");
    setEditStatus(visit.status ? String(visit.status) : "Pending");
    setEditDate(visit.date ? new Date(visit.date) : new Date());

    try {
      const img = await fetchVisitImageBase64(visit._id);
      setEditImageUri(img || null);
    } catch {
      setEditImageUri(null);
    }

    setEditModalVisible(true);
  };

  const saveEditVisit = async () => {
    if (!selectedVisitId) return;

    const updatedVisit = {
      taskName: editTaskName,
      type: editType,
      notes: editNotes,
      status: editStatus,
      date: editDate.toDateString(),
      imageUri: editImageUri,
    };

    try {
      setLoading(true);
      await updateVisit(selectedVisitId, updatedVisit);

      // update local image if changed
      const refreshedImg = await fetchVisitImageBase64(selectedVisitId);
      if (refreshedImg) {
        setVisitImages((prev) => ({ ...prev, [selectedVisitId]: refreshedImg }));
      }

      // update local visits list
      setVisits((prev) =>
        prev.map((v) => (v._id === selectedVisitId ? { ...v, ...updatedVisit } : v))
      );

      setEditModalVisible(false);
      setEditImageUri(null);
      Alert.alert("✅ Success", "Visit updated successfully!");
      setTimeout(() => loadVisits(), 500);
    } catch (err) {
      console.log("❌ Error updating visit:", err);
      Alert.alert("Error ❌", "Failed to update visit.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Delete Visit -------------------
  const removeVisit = (id: string) => {
    Alert.alert("Delete Visit", "Are you sure you want to delete this visit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteVisit(id);
            setSelectedVisit(null);
            loadVisits();
          } catch (err) {
            console.log("Error deleting visit:", err);
            Alert.alert("Error ❌", "Failed to delete visit.");
          }
        },
      },
    ]);
  };

  // ------------------- Search (taskName only) -------------------
  const filteredVisits = visits.filter((v) =>
    (v.taskName || "").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.paddinghorizontal, styles.flex]}>
          <PageHeader title="Visits" />

          <Search
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder="Search Visits by Tasks..."
          />

          <ScrollView>
            {filteredVisits.length === 0 ? (
              <View style={[styles.centeralign, styles.margintop]}>
                <Text style={[styles.locationtxt, styles.color]}>No visits found</Text>
              </View>
            ) : (
              filteredVisits.map((visit) => {
                return (
                  <View key={visit._id} style={[styles.avatarframe,styles.marginBottom1]}>
                    <TouchableOpacity style={[styles.rowitem]} onPress={() => setSelectedVisit(visit)}>
                      <Image source={{ uri: visitImages[visit._id] }} style={[styles.avatarheight, styles.empavatar]}/>

                      <View style={[styles.centeralign, {width:"46%"}]}>
                        <Text style={[styles.status, styles.leftalign,]}>{visit.taskName}</Text>
                        <Text style={styles.leftalign}>{visit.date}</Text>
                      </View>

                      <View style={[styles.statusbg,{backgroundColor:visit.status === "completed" ? "#ebfff1ff" : "#ffedeeff"}]}>
                        <Text style={{color:visit.status==="completed"?"rgba(0, 147, 0, 1)":"rgba(162, 0, 0, 1)",fontWeight:"500",bottom:1}}>
                          {visit.status}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>


          <Modal visible={!!selectedVisit} transparent onRequestClose={() => setSelectedVisit(null)}>
            <View style={[styles.employeecard, styles.centeralign]}>
              {selectedVisit && (
                <View style={[styles.statusframe, styles.gap, styles.width100]}>

                  {/* Data */}
                  <View style={styles.width80}>
                    <Text style={[styles.status,]}>Task : {selectedVisit.taskName}</Text>
                  </View>
                  <Text style={[styles.plantxt, styles.color ]}>Type : {selectedVisit.type}</Text>
                  <Text style={[styles.plantxt, styles.color ]}>Notes : {selectedVisit.notes}</Text>
                  <Text style={[styles.plantxt, styles.color ]}>Date : {selectedVisit.date}</Text>

                  <Text style={{ color: selectedVisit.status==="completed"?"rgba(0, 147, 0, 1)":"rgba(162, 0, 0, 1)",fontWeight: "500"}}>
                    {selectedVisit.status}
                  </Text>

                  <View style={[styles.rowitem, styles.centeralign]}>
                    <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                      <Image source={visitImages[selectedVisit._id]
                            ? { uri: visitImages[selectedVisit._id] }
                            : require("@/assets/images/org.png")
                        } style={[styles.avatarheight, styles.empavatar]}
                      />
                    </TouchableOpacity>


                    <View style={[styles.rowitem, styles.rightalign]}>
                      <TouchableOpacity onPress={() => { setSelectedVisit(null); editVisit(selectedVisit);}}>
                        <View style={[styles.bellicon,styles.centeralign,styles.iconframe]}>
                          <MaterialCommunityIcons name="square-edit-outline" size={28} color="#fff"/>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => removeVisit(selectedVisit._id)}>
                        <View style={[styles.bellicon,styles.centeralign,styles.iconframe]}>
                          <Ionicons name="trash" size={24} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Close */}
                  <TouchableOpacity onPress={()=>setSelectedVisit(null)} style={styles.cross}>
                    <Ionicons name="close" size={35} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>


          {/* Fullscreen Image Modal */}
          <Modal visible={imageModalVisible} onRequestClose={() => setImageModalVisible(false)}>
            <View style={[styles.flex, { backgroundColor: "#000" }]}>
              <Image source={ selectedVisit && visitImages[selectedVisit._id]
                    ? { uri: visitImages[selectedVisit._id] }
                    : require("@/assets/images/org.png")
                } style={{ flex: 1, resizeMode: "contain" }}
              />
              <TouchableOpacity onPress={() => setImageModalVisible(false)} style={[styles.cross]}>
                <Ionicons name="close" size={35} color="#fff" />
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal visible={modalVisible||editModalVisible} onRequestClose={()=>{setModalVisible(false);setEditModalVisible(false)}}>
            <View style={[styles.container, styles.paddinghorizontal, styles.flex]}>
              <History title={editModalVisible?"Edit Visit":"Add Visit"} onPress={()=>{setModalVisible(false);setEditModalVisible(false)}}/>
              <ScrollView>
                <View style={[styles.gap, styles.marginBottom1]}>
                  {/* Task Name */}
                  <InputBox
                    placeholder="Task Name"
                    value={editModalVisible ? editTaskName : taskName}
                    setValue={editModalVisible ? setEditTaskName : setTaskName}
                    autoCapitalize="words"
                  />

                  {/* Type */}
                  <InputBox
                    placeholder="Type"
                    value={editModalVisible ? editType : type}
                    setValue={editModalVisible ? setEditType : setType}
                    autoCapitalize="sentences"
                  />

                  {/* Notes */}
                  <View style={styles.box}>
                    <TextInput
                      placeholder="Notes..."
                      placeholderTextColor="#646464"
                      style={[styles.text, { height: 200 }]}
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      value={editModalVisible ? editNotes : notes}
                      onChangeText={editModalVisible ? setEditNotes : setNotes}
                    />
                  </View>

                  {/* Date Picker */}
                  {(showDate || editPickerVisible) && (
                    <DateTimePicker
                      value={editModalVisible ? editDate : date}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (editModalVisible) {
                          setEditPickerVisible(false);
                          if (selectedDate) setEditDate(selectedDate);
                        } else {
                          setShowDate(false);
                          if (selectedDate) setDate(selectedDate);
                        }
                      }}
                    />
                  )}

                  {editModalVisible && (
                    <View style={[styles.centeralign,styles.rowitem]}>
                      {statusOptions.map((opt) => (
                       <TouchableOpacity key={opt} onPress={() => setEditStatus(opt)} 
                        style={[styles.statusbtn,{backgroundColor:editStatus===opt?opt==="completed"?"#ebfff1ff" : "#ffedeeff":"#fff"}]}>
                        <Text style={[styles.locationtxt,{color:editStatus===opt?opt==="completed"?"rgba(0, 147, 0, 1)":"rgba(162, 0, 0, 1)":"#646464"}]}>{opt}</Text>
                      </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={[styles.rowitem, styles.centeralign]}>
                    <View style={[styles.searchcard, styles.flex, styles.h60, styles.centeralign]}>
                      <Text style={styles.locationtxt}>
                        {editModalVisible ? editDate.toDateString() : date.toDateString()}
                      </Text>
                    </View>
                    <View style={{ width: "45%" }}>
                      <Btn title="Select date" onPress={() => editModalVisible ? setEditPickerVisible(true) : setShowDate(true)}/>
                    </View>
                  </View>

                  <ImagePickerComponent onImageSelect={editModalVisible ? setEditImageUri : setImageUri}/>
                </View>
              </ScrollView>

              {/* Save Button */}
              <View style={[styles.mtop, styles.marginBottom1]}>
                <Btn title={loading ?"Saving...":editModalVisible ?"Save Changes":"Save Visit"} onPress={editModalVisible?saveEditVisit:handleSave} disabled={loading}/>
              </View>
            </View>
          </Modal>
        </View>

        {/* Floating Add Button */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.floatingaddicon}>
          <Image source={require("../../assets/images/add-icon.png")} style={styles.bellicon} />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}