import styles from "@/app/stylesheet/globalstylesheet";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

type Props = {
  onImageSelect?: (uri: string | null) => void;
};

const ImagePickerComponent = ({ onImageSelect }: Props) => {
  const [tempImage, setTempImage] = useState<string | null>(null);

  // Camera
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted)
      return Alert.alert("Permission Denied", "Camera access required.");

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setTempImage(result.assets[0].uri);
      onImageSelect?.(result.assets[0].uri);
    }
  };

  // Gallery
  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted)
      return Alert.alert("Permission Denied", "Gallery access required.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setTempImage(result.assets[0].uri);
      onImageSelect?.(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.bigcard}>
      <View style={styles.rowitem}>
        <TouchableOpacity onPress={openCamera}>
          <Image source={require("@/assets/images/camera-icon.png")} style={styles.cameraicon}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={openGallery}>
          <Image source={require("@/assets/images/file-icon.png")} style={styles.cameraicon}/>
        </TouchableOpacity>

        {tempImage && (
          <View>
            <Image source={{ uri: tempImage }} style={[styles.cameraicon, {borderRadius:20}]} />
            <TouchableOpacity style={styles.removeButton} onPress={()=>{setTempImage(null); onImageSelect?.(null)}}>
              <MaterialIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ImagePickerComponent;
