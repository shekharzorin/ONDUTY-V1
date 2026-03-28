"use client";

import {
  GoogleMap,
  Polyline,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { getMapConfig } from "@/app/backend-api/api";

type MapCompProps = {
  points: any[];
};

const MapComp = ({ points }: MapCompProps) => {
  const [mapKey, setMapKey] = useState<string | null>(null);
  const [mapEnabled, setMapEnabled] = useState<boolean>(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  /* ----------------------------------
     FETCH MAP CONFIG FROM BACKEND
  ---------------------------------- */
  useEffect(() => {
    const loadConfig = async () => {
      const config = await getMapConfig();

      if (config.success && config.mapEnabled && config.webMapKey) {
        setMapKey(config.webMapKey);
        setMapEnabled(true);
      }

      setLoadingConfig(false);
    };

    loadConfig();
  }, []);

  /* ----------------------------------
     LOAD GOOGLE MAP SCRIPT
  ---------------------------------- */
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapKey || "",
    preventGoogleFontsLoading: true,
  });

  /* ----------------------------------
     UI STATES
  ---------------------------------- */

  if (loadingConfig) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading map configuration...
      </div>
    );
  }

  if (!mapEnabled || !mapKey) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        🛑 Map disabled by admin
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading map...
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        📍 Location not available
      </div>
    );
  }

  /* ----------------------------------
     MAP DATA
  ---------------------------------- */
  const path = points.map((p) => ({
    lat: Number(p.latitude),
    lng: Number(p.longitude),
  }));

  return (
    <GoogleMap
      zoom={16}
      center={path[path.length - 1]}
      mapContainerStyle={{ width: "100%", height: "100%" }}
    >
      {/* Start Marker */}
      <Marker position={path[0]} />

      {/* End Marker */}
      <Marker position={path[path.length - 1]} />

      {/* Route */}
      {path.length > 1 && (
        <Polyline
          path={path}
          options={{
            strokeColor: "#2563eb",
            strokeOpacity: 1,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapComp;
