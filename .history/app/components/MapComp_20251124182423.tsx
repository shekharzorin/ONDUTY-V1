import LocationTracker from "@/app/services/LocationTracker";
import styles from "@/app/stylesheet/globalstylesheet";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

type Client = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type MapCompProps = {
  selectedLocation?: { latitude: number; longitude: number };
  selectedClient?: Client;
  onSelectClientPress?: () => void;
  onLocationUpdate?: (coords: { latitude: number; longitude: number }, address: string) => void;
};

const MapComp: React.FC<MapCompProps> = ({
  selectedLocation,
  selectedClient,
  onSelectClientPress,
  onLocationUpdate,
}) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("Fetching location...");
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const update = (coords: { latitude: number; longitude: number }, address: string) => {
      setCurrentLocation(coords);
      setCurrentAddress(address);
      if (onLocationUpdate) onLocationUpdate(coords, address);
    };

    LocationTracker.subscribe(update);
    LocationTracker.startTracking();

    return () => {
      LocationTracker.unsubscribe(update);
    };
  }, []);

  if (!currentLocation) {
    return (
      <View style={[styles.map, styles.centeralign]}>
        <Text style={styles.locationtxt}>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.gap}>
      <View style={[styles.gap5, styles.paddinghorizontal]}>
        <Text style={[styles.locationtxt, styles.color]}>Current Location : {currentAddress}</Text>

        {onSelectClientPress && (
          <TouchableOpacity onPress={onSelectClientPress}>
            <View style={{ justifyContent: "space-between", flex: 1, flexDirection: "row" }}>
              <View style={styles.rowitem}>
                <Text style={[styles.locationtxt, styles.color]}>Select Client:</Text>
                <View style={{ width: "50%" }}>
                  <Text style={[styles.locationtxt, { color: "#8E6BDD" }]}>
                    {selectedClient?.name || "Select a client"}
                  </Text>
                </View>
              </View>
              <FontAwesome name="chevron-down" size={20} color={"#8E6BDD"} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton
          zoomEnabled
          scrollEnabled
        >
          <Marker coordinate={currentLocation} title="You" pinColor="blue" description={currentAddress} />

          {selectedClient && (
            <>
              <Marker
                coordinate={{ latitude: selectedClient.latitude, longitude: selectedClient.longitude }}
                title={selectedClient.name}
                pinColor="green"
              />
              <Polyline
                coordinates={[currentLocation, { latitude: selectedClient.latitude, longitude: selectedClient.longitude }]}
                strokeColor="#8E6BDD"
                strokeWidth={3}
              />
            </>
          )}

          {selectedLocation && !selectedClient && (
            <>
              <Marker coordinate={selectedLocation} title="Selected Location" pinColor="green" />
              <Polyline coordinates={[currentLocation, selectedLocation]} strokeColor="#8E6BDD" strokeWidth={3} />
            </>
          )}
        </MapView>

        <TouchableOpacity
          style={styles.locationicon}
          onPress={() => {
            if (mapRef.current) {
              let target = currentLocation;
              if (selectedClient) target = { latitude: selectedClient.latitude, longitude: selectedClient.longitude };
              else if (selectedLocation) target = selectedLocation;

              mapRef.current.animateToRegion({ latitude: target.latitude, longitude: target.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
            }
          }}
        >
          <Ionicons name="location-sharp" size={28} color="rgba(0, 232, 0, 1)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapComp;
