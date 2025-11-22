import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InteractiveMap } from "@/components/Maps/InteractiveMap";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { CHENNAI_CENTER, mockHouseMarkers } from "@/data/mockData";

interface DumpsProps {
  onClose: () => void;
}

export function Dumps({ onClose }: DumpsProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedHouse, setSelectedHouse] = useState<any>(null);

  const handleHouseClick = (houseId: string) => {
    const house = mockHouseMarkers.find(h => h.id === houseId);
    setSelectedHouse(house);
  };

  const handleCall = (phone: string) => {
    toast({
      title: "Calling...",
      description: `Calling ${phone}`,
    });
  };

  const handleSMS = (phone: string) => {
    toast({
      title: "SMS Sent",
      description: `Message sent to ${phone}`,
    });
  };

  const handleMarkCollected = (houseId: string) => {
    toast({
      title: "Status Updated",
      description: "House marked as collected",
    });
    setSelectedHouse(null);
  };

  const handleReport = (houseId: string) => {
    const reason = prompt("Reason for reporting:");
    if (reason) {
      toast({
        title: "Report Submitted",
        description: `Report submitted: ${reason}`,
        variant: "destructive"
      });
      setSelectedHouse(null);
    }
  };

  const mapMarkers = mockHouseMarkers.map(house => ({
    id: house.id,
    lat: house.lat,
    lng: house.lng,
    icon: house.status === 'available' ? '🏠' : '🏘️',
    popup: `${house.doorNumber} - ${house.householder}`,
    onClick: () => handleHouseClick(house.id)
  }));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('dumps')} Management</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Map */}
        <InteractiveMap
          center={CHENNAI_CENTER}
          markers={mapMarkers}
          height="400px"
          className="rounded-xl"
        />

        <GlassCard>
          <p className="text-foreground text-center">
            Click on house markers to view details and manage collection
          </p>
        </GlassCard>

        {/* House Details */}
        {selectedHouse && (
          <GlassCard>
            <h3 className="text-xl font-semibold text-foreground mb-4">House Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Door Number</p>
                  <p className="font-semibold text-foreground">{selectedHouse.doorNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Household Name</p>
                  <p className="font-semibold text-foreground">{selectedHouse.householder}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{selectedHouse.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beacon Score</p>
                  <p className="font-semibold text-foreground">{selectedHouse.beaconScore}/100</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <Button
                  onClick={() => handleCall(selectedHouse.phone)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="call-button"
                >
                  📞 Call
                </Button>
                <Button
                  onClick={() => handleSMS(selectedHouse.phone)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  data-testid="sms-button"
                >
                  💬 SMS
                </Button>
                <Button
                  onClick={() => handleMarkCollected(selectedHouse.id)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="collected-button"
                >
                  ✅ Collected
                </Button>
                <Button
                  onClick={() => handleReport(selectedHouse.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-testid="report-button"
                >
                  ⚠️ Report
                </Button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Collection Status */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-3">Collection Status</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500">
                {mockHouseMarkers.filter(h => h.status === 'available').length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {mockHouseMarkers.filter(h => h.status === 'not-available').length}
              </div>
              <div className="text-sm text-muted-foreground">Not Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {mockHouseMarkers.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Houses</div>
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
