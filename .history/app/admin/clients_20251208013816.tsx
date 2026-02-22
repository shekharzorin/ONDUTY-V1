import {
  addClient,
  adminDeleteClient,
  adminGetClients,
  fetchClientImage,
  updateClient
} from "@/app/backend-api/api";
import Btn from "@/app/components/Btn";
import ImagePickerComponent from "@/app/components/ImagePicker";
import InputBox from "@/app/components/InputBox";
import MapComp from "@/app/components/MapComp";
import PageHeader from "@/app/components/PageHeader";
import Search from "@/app/components/Search";
import styles from "@/app/stylesheet/globalstylesheet";
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
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import History from "../components/History";

type ClientType = {
  _id: string;
  name: string;
  address: string;
  clientNumber: string;
  latitude: number;
  longitude: number;
};

const Client = () => {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [clientImages, setClientImages] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [clientImage, setClientImage] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  // ---------------- FETCH CLIENTS ----------------
  const fetchClients = async () => {
    try {
      setLoading(true);

      const response = await adminGetClients();

      if (!response || !response.clients) {
        setClients([]);
        setClientImages({});
        return;
      }

      const formattedClients = response.clients;

      // Show client data immediately
      setClients(formattedClients);

      // Fetch images in parallel
      const imgs: Record<string, string> = {};

      formattedClients.forEach((c: { _id?: string }) => {
        if (c._id) {
          fetchClientImage(c._id)
            .then((img) => {
              if (img) {
                imgs[c._id as string] = img;
                // Update state progressively
                setClientImages((prev) => ({ ...prev, [c._id as string]: img }));
              }
            })
            .catch(() => {
              console.log(`⚠️ No image for client ${c._id}`);
            });
        }
      });
    } catch (error) {
      console.log("❌ Fetch clients error:", error);
      Alert.alert("Error", "Unable to load clients");
      setClients([]);
      setClientImages({});
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    if (isFocused) fetchClients();
  }, [isFocused]);

  // ---------------- ADD / UPDATE CLIENT ----------------
  const handleSubmit = async () => {
    if (!name.trim() || !number.trim() || !currentCoords)
      return Alert.alert("❌ Error", "Please fill all required fields.");

    try {
      setLoading(true);

      if (editingClientId) {
        await updateClient(editingClientId, {
          name,
          address: currentAddress,
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
          clientNumber: number,
          imageUri: clientImage,
        });
        Alert.alert("✅ Updated", "Client updated successfully.");
      } else {
        await addClient({
          name,
          address: currentAddress,
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
          clientNumber: number,
          imageUri: clientImage,
        });
        Alert.alert("✅ Added", "Client added successfully.");
      }

      resetForm();
      setTimeout(fetchClients, 300);
    } catch (error: any) {
      console.error("Error saving client:", error);
      Alert.alert(
        "❌ Error",
        error?.response?.data?.message || "Failed to save client."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingClientId(null);
    setName("");
    setNumber("");
    setCurrentCoords(null);
    setCurrentAddress("");
    setClientImage(null);
  };

  // ---------------- DELETE CLIENT ----------------
  const handleDelete = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure to delete this client?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminDeleteClient(id);
            Alert.alert("✅ Deleted", "Client deleted successfully.");
            fetchClients();
            setSelectedClient(null);
          } catch (err: any) {
            console.error("Error deleting client:", err);
            Alert.alert(
              "❌ Error",
              err?.response?.data?.message || "Failed to delete client."
            );
          }
        },
      },
    ]);
  };

  // ---------------- EDIT CLIENT ----------------
  const handleEditClient = async (client: ClientType) => {
    setName(client.name);
    setNumber(client.clientNumber);
    setCurrentAddress(client.address);
    setCurrentCoords({
      latitude: client.latitude,
      longitude: client.longitude,
    });
    setEditingClientId(client._id);
    setModalVisible(true);

    try {
      const img = await fetchClientImage(client._id);
      setClientImage(img || null);
    } catch {
      setClientImage(null);
    }
  };

  const resetForm = () => {
    setName("");
    setNumber("");
    setClientImage(null);
    setCurrentAddress("");
    setCurrentCoords(null);
    setEditingClientId(null);
    setModalVisible(false);
  };

  // ---------------- FILTER SEARCH ----------------
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.flex}>
          <View style={[styles.paddinghorizontal, styles.flex]}>
            <PageHeader title="Clients" />

            <Search
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder="Search Clients..."
            />

            <FlatList
              data={filteredClients}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.avatarframe, styles.marginBottom1]}
                  onPress={() => setSelectedClient(item)}
                >
                  <View style={[styles.rowitem, styles.flex]}>
                    <View style={styles.centeralign}>
                      <Image
                        source={
                          clientImages[item._id]
                            ? { uri: clientImages[item._id] }
                            : require("@/assets/images/org.png")
                        }
                        style={[styles.avatarheight, styles.empavatar]}
                      />
                    </View>

                    <View
                      style={[
                        styles.gap5,
                        styles.width80,
                        { justifyContent: "center" },
                      ]}
                    >
                      <Text style={[styles.status]}>{item.name}</Text>
                      <View style={[styles.rowitem, { alignItems: "center" }]}>
                        <Ionicons
                          name="location-sharp"
                          size={24}
                          color="#646464"
                        />
                        <Text style={[styles.color, styles.width70]}>
                          {item.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={[styles.centeralign, styles.margintop]}>
                  <Text style={[styles.locationtxt, styles.color]}>
                    No clients found
                  </Text>
                </View>
              )}
            />
          </View>

          <Modal
            visible={!!selectedClient}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedClient(null)}
          >
            <View style={[styles.employeecard, styles.centeralign]}>
              {selectedClient && (
                <View
                  style={[styles.statusframe, styles.gap, styles.width100]}
                >
                  <Image
                    source={
                      clientImages[selectedClient._id]
                        ? { uri: clientImages[selectedClient._id] }
                        : require("@/assets/images/org.png")
                    }
                    resizeMode="cover"
                    style={styles.clientbanner}
                  />

                  <Text style={[styles.status]}>
                    Client : {selectedClient.name}
                  </Text>
                  <Text style={[styles.plantxt, styles.color]}>
                    Location : {selectedClient.address}
                  </Text>
                  <Text style={[styles.plantxt, styles.color]}>
                    Number : {selectedClient.clientNumber}
                  </Text>

                  <View style={[styles.rowitem, styles.centeralign]}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedClient(null);
                        handleEditClient(selectedClient);
                      }}
                      style={styles.rightalign}
                    >
                      <View
                        style={[
                          styles.bellicon,
                          styles.centeralign,
                          styles.iconframe,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="square-edit-outline"
                          size={28}
                          color="#fff"
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(selectedClient._id)}
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
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => setSelectedClient(null)}
                    style={[styles.cross]}
                  >
                    <Ionicons name="close" size={35} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.floatingaddicon}
          >
            <Image
              source={require("../../assets/images/add-icon.png")}
              style={styles.bellicon}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} onRequestClose={handleCloseModal}>
        <SafeAreaProvider style={styles.container}>
          <SafeAreaView style={styles.flex}>
            <View style={[styles.paddinghorizontal, styles.flex]}>
              <History
                title={editingClientId ? "Edit Client" : "Add Client"}
                onPress={handleCloseModal}
              />

              <ScrollView>
                <View style={[styles.gap, styles.marginBottom1]}>
                  <InputBox
                    placeholder="Client Name"
                    autoCapitalizeType="words"
                    value={name}
                    setValue={setName}
                  />

                  <InputBox
                    placeholder="Client Number"
                    keyboardType="numeric"
                    value={number}
                    setValue={setNumber}
                  />

                  <MapComp
                    selectedLocation={currentCoords || undefined}
                    onLocationUpdate={(coords, address) => {
                      setCurrentCoords(coords ?? null);
                      setCurrentAddress(address);
                    }}
                  />

                  <ImagePickerComponent onImageSelect={setClientImage} />
                </View>
              </ScrollView>

              <View style={[styles.mtop, styles.marginBottom1]}>
                <Btn
                  title={
                    loading
                      ? "Saving..."
                      : editingClientId
                        ? "Update Client"
                        : "Add Client"
                  }
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
};

export default Client;
