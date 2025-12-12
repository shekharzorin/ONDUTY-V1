"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface Location {
    id: string;
    lat: number;
    lng: number;
    name: string;
    status: string; // Active, Idle, Offline
    image?: string;
    address?: string;
}

interface MapProps {
    locations: Location[];
    onMarkerClick?: (id: string) => void;
}

// Component to update map view when locations change
function MapUpdater({ locations }: { locations: Location[] }) {
    const map = useMap();

    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations, map]);

    return null;
}

export default function Map({ locations, onMarkerClick }: MapProps) {
    return (
        <MapContainer
            center={[20.5937, 78.9629]} // Center of India (approx)
            zoom={5}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lng]}
                    icon={icon} // Use custom icon or dynamic icon based on status
                    eventHandlers={{
                        click: () => onMarkerClick && onMarkerClick(loc.id),
                    }}
                >
                    <Popup>
                        <div className="flex items-center gap-3 min-w-[200px]">
                            <img src={loc.image || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="font-bold text-gray-800">{loc.name}</h3>
                                <div className="flex items-center gap-1 text-xs mt-0.5">
                                    <span className={`w-2 h-2 rounded-full ${loc.status === "Active" ? "bg-green-500" :
                                            loc.status === "Idle" ? "bg-orange-500" :
                                                "bg-gray-400"
                                        }`} />
                                    {loc.status}
                                </div>
                            </div>
                        </div>
                        {loc.address && <p className="text-xs text-gray-500 mt-2 border-t pt-2">{loc.address}</p>}
                    </Popup>
                </Marker>
            ))}

            <MapUpdater locations={locations} />
        </MapContainer>
    );
}
