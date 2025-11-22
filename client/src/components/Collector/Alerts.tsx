import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InteractiveMap, DirectionsButton } from "@/components/Maps/InteractiveMap";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { CHENNAI_CENTER, mockOverflowReports } from "@/data/mockData";

interface AlertsProps {
  onClose: () => void;
}

export function Alerts({ onClose }: AlertsProps) {
  const { t } = useLanguage();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const mapMarkers = mockOverflowReports.map(report => ({
    id: report.id,
    lat: report.location.lat,
    lng: report.location.lng,
    icon: report.type === 'dumps' ? '🗑️' : report.type === 'water' ? '💧' : '⚠️',
    popup: `${report.type} overflow at ${report.location.address}`
  }));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">Overflow {t('alerts')}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Map */}
        <InteractiveMap
          center={CHENNAI_CENTER}
          markers={mapMarkers}
          height="300px"
          showOverflowCircles={true}
          className="rounded-xl"
        />

        {/* Alert Reports */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Recent Overflow Reports</h4>
          
          {mockOverflowReports.map((report) => (
            <GlassCard key={report.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {report.type === 'dumps' ? '🗑️' : 
                       report.type === 'water' ? '💧' : '⚠️'}
                    </span>
                    <h4 className="font-semibold text-foreground capitalize">
                      {report.location.address} - {report.type} Overflow
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.priority === 'high' ? 'bg-red-500 text-white' :
                      report.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {report.priority}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Reported by: {report.reportedBy}</p>
                    <p>Status: <span className="capitalize font-medium">{report.status}</span></p>
                    <p>Time: {report.reportedAt.toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <DirectionsButton 
                  destination={report.location.address}
                  className="ml-4"
                />
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Alert Summary */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-3">Alert Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">
                {mockOverflowReports.filter(r => r.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {mockOverflowReports.filter(r => r.priority === 'medium').length}
              </div>
              <div className="text-sm text-muted-foreground">Medium Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {mockOverflowReports.filter(r => r.priority === 'low').length}
              </div>
              <div className="text-sm text-muted-foreground">Low Priority</div>
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
