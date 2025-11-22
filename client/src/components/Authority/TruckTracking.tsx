import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InteractiveMap } from "@/components/Maps/InteractiveMap";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { CHENNAI_CENTER, mockTruckLocations } from "@/data/mockData";

interface TruckTrackingProps {
  onClose: () => void;
}

export function TruckTracking({ onClose }: TruckTrackingProps) {
  const { t } = useLanguage();
  const [trucks, setTrucks] = useState(mockTruckLocations);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);

  useEffect(() => {
    // Simulate real-time truck movement
    const interval = setInterval(() => {
      setTrucks(prevTrucks => 
        prevTrucks.map(truck => ({
          ...truck,
          lat: truck.lat + (Math.random() - 0.5) * 0.001,
          lng: truck.lng + (Math.random() - 0.5) * 0.001,
          progress: Math.min(100, truck.progress + Math.floor(Math.random() * 5))
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTruckClick = (truckId: string) => {
    const truck = trucks.find(t => t.id === truckId);
    setSelectedTruck(truck);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'maintenance': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'maintenance': return '🔧';
      case 'offline': return '❌';
      default: return '❓';
    }
  };

  const mapMarkers = trucks.map(truck => ({
    id: truck.id,
    lat: truck.lat,
    lng: truck.lng,
    icon: truck.status === 'active' ? '🚛' : '🚧',
    popup: `${truck.name} - ${truck.route} Route (${truck.progress}%)`,
    onClick: () => handleTruckClick(truck.id)
  }));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('truck-tracking')}</DialogTitle>
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

        {/* Fleet Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Trucks</h4>
            <p className="text-2xl font-bold text-green-500">
              {trucks.filter(t => t.status === 'active').length}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">In Maintenance</h4>
            <p className="text-2xl font-bold text-yellow-500">
              {trucks.filter(t => t.status === 'maintenance').length}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Progress</h4>
            <p className="text-2xl font-bold text-primary">
              {Math.round(trucks.reduce((sum, t) => sum + t.progress, 0) / trucks.length)}%
            </p>
          </GlassCard>
        </div>

        {/* Truck List */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-4">Fleet Status</h4>
          <div className="space-y-3">
            {trucks.map((truck) => (
              <div 
                key={truck.id}
                className={`p-3 glassmorphism rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                  selectedTruck?.id === truck.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTruckClick(truck.id)}
                data-testid={`truck-${truck.id}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚛</span>
                      <h5 className="font-semibold text-foreground">{truck.name}</h5>
                      <span>{getStatusIcon(truck.status)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{truck.route} Route</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium capitalize ${getStatusColor(truck.status)}`}>
                        {truck.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${truck.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{truck.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Selected Truck Details */}
        {selectedTruck && (
          <GlassCard>
            <h4 className="font-semibold text-foreground mb-4">Truck Details - {selectedTruck.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold text-foreground">{selectedTruck.route}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`font-semibold capitalize ${getStatusColor(selectedTruck.status)}`}>
                  {selectedTruck.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-semibold text-foreground">{selectedTruck.progress}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">
                  {selectedTruck.lat.toFixed(4)}, {selectedTruck.lng.toFixed(4)}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button 
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="track-truck"
              >
                📍 Track Live
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="glassmorphism border-0"
                data-testid="contact-driver"
              >
                📞 Contact Driver
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="glassmorphism border-0"
                data-testid="view-route"
              >
                🗺️ View Route
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Close Button */}
        <Button onClick={onClose} variant="outline" className="w-full glassmorphism border-0">
          Close
        </Button>
      </div>
    </>
  );
}
