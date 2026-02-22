import { getMapConfig } from "@/app/backend-api/api";
import LocationTracker from "@/app/services/LocationTracker";
import styles from "@/app/stylesheet/globalstylesheet";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
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
  onLocationUpdate?: (
    coords: { latitude: number; longitude: number },
    address: string,
  ) => void;
};

const MapComp: React.FC<MapCompProps> = ({
  selectedLocation,
  selectedClient,
  onSelectClientPress,
  onLocationUpdate,
}) => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [currentAddress, setCurrentAddress] = useState("Fetching location...");
  const [mapKey, setMapKey] = useState<string | null>(null);

  const mapRef = useRef<MapView | null>(null);

  /* =====================================================
     INITIALIZE MAP + CHECK SUPER ADMIN CONFIG
  ===================================================== */
  useEffect(() => {
    let updateCallback: any;

    const initMap = async () => {
      try {
        // ✅ fetch config from backend
        const config = await getMapConfig();

        // ❌ backend error
        if (!config.success) {
          setCurrentAddress("Cannot connect to server");
          return;
        }

        // ❌ map disabled
        if (!config.mapEnabled) {
          setCurrentAddress("Map disabled by admin");
          LocationTracker.stopTracking();
          return;
        }

        /* =============================================
           ✅ SELECT PLATFORM MAP KEY
        ============================================= */
        let selectedKey = null;

        if (Platform.OS === "android") {
          selectedKey = config.androidMapKey;
        } else if (Platform.OS === "ios") {
          selectedKey = config.iosMapKey;
        } else {
          selectedKey = config.webMapKey;
        }

        setMapKey(selectedKey);
        console.log("✅ Using map key:", selectedKey);

        /* =============================================
           START LOCATION TRACKING
        ============================================= */
        updateCallback = (
          coords: { latitude: number; longitude: number },
          address: string,
        ) => {
          setCurrentLocation(coords);
          setCurrentAddress(address);
          onLocationUpdate?.(coords, address);
        };

        LocationTracker.subscribe(updateCallback);
        await LocationTracker.startTracking();
      } catch (err) {
        console.log("❌ Map init error:", err);
        setCurrentAddress("Failed to load map");
      }
    };

    initMap();

    // cleanup
    return () => {
      if (updateCallback) {
        LocationTracker.unsubscribe(updateCallback);
      }
    };
  }, []);

  /* =====================================================
     UI STATES
  ===================================================== */

  // map disabled
  if (!currentLocation && currentAddress === "Map disabled by admin") {
    return (
      <View style={[styles.map, styles.centeralign]}>
        <Text style={styles.locationtxt}>Map disabled by admin</Text>
      </View>
    );
  }

  // loading
  if (!currentLocation) {
    return (
      <View style={[styles.map, styles.centeralign]}>
        <Text style={styles.locationtxt}>{currentAddress}</Text>
      </View>
    );
  }

  /* =====================================================
     MAP UI
  ===================================================== */
  return (
    <View style={styles.gap}>
      {/* HEADER INFO */}
      <View style={[styles.gap5, styles.paddinghorizontal]}>
        <Text style={[styles.locationtxt, styles.color]}>
          Current Location : {currentAddress}
        </Text>

        {onSelectClientPress && (
          <TouchableOpacity onPress={onSelectClientPress}>
            <View
              style={{
                justifyContent: "space-between",
                flex: 1,
                flexDirection: "row",
              }}
            >
              <View style={styles.rowitem}>
                <Text style={[styles.locationtxt, styles.color]}>
                  Select Client:
                </Text>

                <View style={{ width: "50%" }}>
                  <Text style={[styles.locationtxt, { color: "#8E6BDD" }]}>
                    {selectedClient?.name || "Select a client"}
                  </Text>
                </View>
              </View>

              <FontAwesome name="chevron-down" size={20} color="#8E6BDD" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* MAP */}
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
          {/* USER MARKER */}
          <Marker
            coordinate={currentLocation}
            title="You"
            pinColor="blue"
            description={currentAddress}
          />

          {/* CLIENT MARKER */}
          {selectedClient && (
            <>
              <Marker
                coordinate={{
                  latitude: selectedClient.latitude,
                  longitude: selectedClient.longitude,
                }}
                title={selectedClient.name}
                pinColor="green"
              />

              <Polyline
                coordinates={[
                  currentLocation,
                  {
                    latitude: selectedClient.latitude,
                    longitude: selectedClient.longitude,
                  },
                ]}
                strokeColor="#8E6BDD"
                strokeWidth={3}
              />
            </>
          )}

          {/* SELECTED LOCATION */}
          {selectedLocation && !selectedClient && (
            <>
              <Marker
                coordinate={selectedLocation}
                title="Selected Location"
                pinColor="green"
              />

              <Polyline
                coordinates={[currentLocation, selectedLocation]}
                strokeColor="#8E6BDD"
                strokeWidth={3}
              />
            </>
          )}
        </MapView>

        {/* CENTER LOCATION BUTTON */}
        <TouchableOpacity
          style={styles.locationicon}
          onPress={() => {
            if (!mapRef.current) return;

            let target = currentLocation;

            if (selectedClient) {
              target = {
                latitude: selectedClient.latitude,
                longitude: selectedClient.longitude,
              };
            } else if (selectedLocation) {
              target = selectedLocation;
            }

            mapRef.current.animateToRegion({
              latitude: target.latitude,
              longitude: target.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }}
        >
          <Ionicons
            name="location-sharp"
            size={28}
            color="rgba(0, 232, 0, 1)"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapComp;
