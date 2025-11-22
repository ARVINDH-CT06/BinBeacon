import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  icon: string;
  popup?: string;
  onClick?: () => void;
}

interface InteractiveMapProps {
  center?: MapLocation;
  markers?: MapMarker[];
  onMapClick?: (location: MapLocation) => void;
  height?: string;
  className?: string;
  showTruckAnimation?: boolean;
  showOverflowCircles?: boolean;
}

export function InteractiveMap({
  center = { lat: 13.0827, lng: 80.2707 }, // Chennai
  markers = [],
  onMapClick,
  height = "400px",
  className = "",
  showTruckAnimation = false,
  showOverflowCircles = false
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletMap, setLeafletMap] = useState<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      try {
        const Lmod = await import("leaflet");
        const L = (Lmod && (Lmod as any).default) ? (Lmod as any).default : Lmod;

        if (!mapRef.current) return;
        mapRef.current.innerHTML = "";

        const map = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: 13,
          scrollWheelZoom: true,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        // Add markers
        markers.forEach((marker) => {
          const icon = L.divIcon({
            html: `<div style="font-size: 22px; text-align:center;">${marker.icon}</div>`,
            className: "",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          const leafletMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(map);
          if (marker.popup) leafletMarker.bindPopup(marker.popup);
          if (marker.onClick) leafletMarker.on("click", marker.onClick);
        });

        if (onMapClick) {
          map.on("click", (e: any) => {
            onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
          });
        }

        if (mounted) {
          setLeafletMap(map);
          setIsMapReady(true);
        }
      } catch (error) {
        console.error("Failed to load Leaflet:", error);
        setIsMapReady(false);
      }
    };

    loadLeaflet();

    return () => {
      mounted = false;
      if (leafletMap) {
        try {
          leafletMap.remove();
        } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Fallback when Leaflet fails
  const FallbackMap = () => (
    <div className={`relative overflow-hidden rounded-xl glassmorphism ${className}`} style={{ height }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="font-semibold text-foreground">Chennai - Interactive Map</p>
          <p className="text-sm text-muted-foreground">Live tracking active</p>
          {showTruckAnimation && (
            <div className="mt-4">
              <div className="text-3xl animate-truck-move">🚛</div>
            </div>
          )}
        </div>
      </div>

      {/* Mock markers overlay */}
      {markers.map((marker, index) => (
        <div
          key={marker.id}
          className="absolute cursor-pointer transform hover:scale-110 transition-all"
          style={{
            top: `${20 + index * 15}%`,
            left: `${30 + index * 20}%`,
            zIndex: 10,
          }}
          onClick={marker.onClick}
        >
          <div className="text-2xl bg-white rounded-full p-1 shadow-lg">
            {marker.icon}
          </div>
        </div>
      ))}

      {showOverflowCircles && (
        <>
          <div className="absolute top-1/4 left-1/3 w-8 h-8 overflow-circle" />
          <div className="absolute top-1/2 left-1/2 w-8 h-8 overflow-circle" />
        </>
      )}

      {onMapClick && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Click anywhere to mark location
          </p>
        </div>
      )}
    </div>
  );

  if (!isMapReady) {
    return <FallbackMap />;
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}

export function DirectionsButton({
  destination,
  className = "",
}: {
  destination?: string;
  className?: string;
}) {
  const handleGetDirections = () => {
    const baseUrl = "https://www.google.com/maps/dir/";
    const currentLocation = "Current+Location";
    const dest = destination || "Chennai,+Tamil+Nadu,+India";

    const url = `${baseUrl}${currentLocation}/${encodeURIComponent(dest)}`;
    window.open(url, "_blank");
  };

  return (
    <Button
      onClick={handleGetDirections}
      className={`bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}
      data-testid="get-directions"
    >
      🗺️ Get Directions
    </Button>
  );
}
