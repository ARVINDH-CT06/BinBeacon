import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InteractiveMap } from "@/components/Maps/InteractiveMap";
import { useLanguage } from "@/hooks/use-language";
import { useVoice } from "@/hooks/use-voice";
import { useToast } from "@/hooks/use-toast";
import { CHENNAI_CENTER } from "@/data/mockData";

interface OverflowReportingProps {
  onClose: () => void;
}

export function OverflowReporting({ onClose }: OverflowReportingProps) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isReported, setIsReported] = useState(false);

  const overflowTypes = [
    { id: 'dumps', icon: '🗑️', label: 'General Dumps' },
    { id: 'water', icon: '💧', label: 'Water Contamination' },
    { id: 'plastic', icon: '♻️', label: 'Plastic Waste' },
    { id: 'other', icon: '⚠️', label: 'Other' }
  ];

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleMapClick = (location: { lat: number; lng: number }) => {
    if (!selectedType) {
      toast({
        title: "Select Type First",
        description: "Please select an overflow type before marking location",
        variant: "destructive"
      });
      return;
    }
    setSelectedLocation(location);
  };

  const handleSubmitReport = async () => {
    if (!selectedType || !selectedLocation) {
      toast({
        title: "Incomplete Report",
        description: "Please select overflow type and location",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/overflow-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId: 'resident-1', // This would come from auth context
          overflowType: selectedType,
          location: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            address: "Selected Location in Chennai"
          }
        })
      });

      if (response.ok) {
        setIsReported(true);
        speak('voice-report-sent');
        toast({
          title: "Report Submitted",
          description: t('report-submitted')
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive"
      });
    }
  };

  if (isReported) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-foreground">Report Submitted</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <div className="text-6xl">✅</div>
          <h3 className="text-xl font-semibold text-foreground">Report Submitted Successfully</h3>
          <p className="text-muted-foreground">
            Your overflow report has been sent to the municipality. The issue will be resolved shortly.
          </p>
          <Button onClick={onClose} className="w-full bg-primary text-primary-foreground">
            Close
          </Button>
        </div>
      </>
    );
  }

  const mapMarkers = selectedLocation ? [
    {
      id: "overflow-marker",
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      icon: "🚨",
      popup: "Reported Overflow Location"
    }
  ] : [];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('overflow-reporting')}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Overflow Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Overflow Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {overflowTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`glassmorphism rounded-xl p-4 transition-all hover:scale-105 ${
                  selectedType === type.id 
                    ? 'bg-destructive text-destructive-foreground' 
                    : 'hover:bg-destructive hover:text-destructive-foreground'
                }`}
                data-testid={`overflow-type-${type.id}`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <p className="text-sm font-medium">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Location on Map
          </label>
          <InteractiveMap
            center={CHENNAI_CENTER}
            markers={mapMarkers}
            onMapClick={handleMapClick}
            height="300px"
            showOverflowCircles={true}
            className="rounded-xl"
          />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Click on the map to mark overflow location
          </p>
        </div>

        {/* Selected Information */}
        {selectedType && selectedLocation && (
          <div className="glassmorphism rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Report Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="text-foreground font-medium">
                  {overflowTypes.find(t => t.id === selectedType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground font-medium">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmitReport}
            disabled={!selectedType || !selectedLocation}
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-testid="submit-overflow-report"
          >
            Submit Report
          </Button>
          <Button onClick={onClose} variant="outline" className="glassmorphism border-0">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
