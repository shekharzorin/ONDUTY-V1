"use client";

import { GoogleMap, Polyline, Marker, useLoadScript } from "@react-google-maps/api";

type MapCompProps = {
  points: any[];
};

const MapComp = ({ points }: MapCompProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

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
      {/* Start marker */}
      <Marker position={path[0]} />

      {/* End marker */}
      <Marker position={path[path.length - 1]} />

      {/* Route line */}
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
