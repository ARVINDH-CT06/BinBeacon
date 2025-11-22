import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glassmorphism";
import { InteractiveMap, DirectionsButton } from "@/components/Maps/InteractiveMap";
import { useLanguage } from "@/hooks/use-language";
import { useVoice } from "@/hooks/use-voice";
import { CHENNAI_CENTER, mockTruckLocations } from "@/data/mockData";

interface GarCarTrackerProps {
  onClose: () => void;
}

export function GarCarTracker({ onClose }: GarCarTrackerProps) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [estimatedTime, setEstimatedTime] = useState(10);
  const [truckLocation, setTruckLocation] = useState(mockTruckLocations[0]);

  useEffect(() => {
    speak('voice-truck-arriving');
    
    // Simulate truck movement
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(1, prev - 1));
      setTruckLocation(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [speak]);

  const mapMarkers = [
    {
      id: "truck",
      lat: truckLocation.lat,
      lng: truckLocation.lng,
      icon: "🚛",
      popup: `Truck ${truckLocation.name} - ${truckLocation.route} Route`
    },
    {
      id: "home",
      lat: CHENNAI_CENTER.lat + 0.005,
      lng: CHENNAI_CENTER.lng + 0.005,
      icon: "🏠",
      popup: "Your Home - DR001"
    }
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('garcar-tracker')}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Map */}
        <InteractiveMap
          center={CHENNAI_CENTER}
          markers={mapMarkers}
          height="400px"
          showTruckAnimation={true}
          className="rounded-xl"
        />

        {/* Arrival Information */}
        <GlassCard className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-foreground">Estimated Arrival</h3>
          <p className="text-3xl font-bold text-primary mb-4">
            {estimatedTime} minute{estimatedTime !== 1 ? 's' : ''}
          </p>
          <p className="text-muted-foreground mb-4">
            🚛 Truck will reach your home in {estimatedTime} minutes
          </p>
          <DirectionsButton 
            destination="Anna Nagar, Chennai"
            className="w-full"
          />
        </GlassCard>

        {/* Truck Details */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-3">Truck Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Truck ID:</span>
              <span className="text-foreground font-medium">{truckLocation.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route:</span>
              <span className="text-foreground font-medium">{truckLocation.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-500 font-medium capitalize">{truckLocation.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Progress:</span>
              <span className="text-foreground font-medium">{truckLocation.progress}%</span>
            </div>
          </div>
        </GlassCard>

        {/* Close Button */}
        <Button onClick={onClose} variant="outline" className="w-full glassmorphism border-0">
          Close
        </Button>
      </div>
    </>
  );
}
