import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InteractiveMap } from "@/components/Maps/InteractiveMap";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { CHENNAI_CENTER, mockOverflowReports, mockCollectors } from "@/data/mockData";

interface OverflowManagementProps {
  onClose: () => void;
}

export function OverflowManagement({ onClose }: OverflowManagementProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [reports, setReports] = useState(mockOverflowReports);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [assigningCollector, setAssigningCollector] = useState<string | null>(null);

  const handleReportClick = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    setSelectedReport(report);
  };

  const handleAssignCollector = async (reportId: string, collectorId: string) => {
    try {
      const response = await fetch(`/api/overflow-reports/${reportId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedCollectorId: collectorId, status: 'assigned' })
      });

      if (response.ok) {
        setReports(prevReports =>
          prevReports.map(report =>
            report.id === reportId 
              ? { ...report, status: 'assigned', assignedCollectorId: collectorId }
              : report
          )
        );
        
        toast({
          title: "Collector Assigned",
          description: "Collector has been assigned to this overflow report"
        });
        setAssigningCollector(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign collector",
        variant: "destructive"
      });
    }
  };

  const handleMarkResolved = async (reportId: string) => {
    try {
      const response = await fetch(`/api/overflow-reports/${reportId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });

      if (response.ok) {
        setReports(prevReports =>
          prevReports.map(report =>
            report.id === reportId 
              ? { ...report, status: 'resolved' }
              : report
          )
        );
        
        toast({
          title: "Report Resolved",
          description: "Overflow report has been marked as resolved"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve report",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-red-500';
      case 'assigned': return 'text-yellow-500';
      case 'resolved': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const mapMarkers = reports.map(report => ({
    id: report.id,
    lat: report.location.lat,
    lng: report.location.lng,
    icon: report.priority === 'high' ? '🚨' : 
          report.type === 'dumps' ? '🗑️' : 
          report.type === 'water' ? '💧' : '⚠️',
    popup: `${report.type} overflow at ${report.location.address} - ${report.priority} priority`,
    onClick: () => handleReportClick(report.id)
  }));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">Overflow Management</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Map */}
        <InteractiveMap
          center={CHENNAI_CENTER}
          markers={mapMarkers}
          height="350px"
          showOverflowCircles={true}
          className="rounded-xl"
        />

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Reports</h4>
            <p className="text-2xl font-bold text-foreground">{reports.length}</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Pending</h4>
            <p className="text-2xl font-bold text-red-500">
              {reports.filter(r => r.status === 'pending').length}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Assigned</h4>
            <p className="text-2xl font-bold text-yellow-500">
              {reports.filter(r => r.status === 'assigned').length}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Resolved</h4>
            <p className="text-2xl font-bold text-green-500">
              {reports.filter(r => r.status === 'resolved').length}
            </p>
          </GlassCard>
        </div>

        {/* Reports List */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-4">All Reports</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
            {reports.map((report) => (
              <div 
                key={report.id}
                className={`p-4 glassmorphism rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                  selectedReport?.id === report.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleReportClick(report.id)}
                data-testid={`report-${report.id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {report.type === 'dumps' ? '🗑️' : 
                         report.type === 'water' ? '💧' : '⚠️'}
                      </span>
                      <h5 className="font-semibold text-foreground capitalize">
                        {report.location.address} - {report.type} Overflow
                      </h5>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Reported by: {report.reportedBy}</p>
                      <p>Time: {report.reportedAt.toLocaleString()}</p>
                      <p>Status: <span className={`font-medium capitalize ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {report.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssigningCollector(report.id);
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid={`assign-${report.id}`}
                      >
                        Assign
                      </Button>
                    )}
                    
                    {(report.status === 'assigned' || report.status === 'pending') && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkResolved(report.id);
                        }}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        data-testid={`resolve-${report.id}`}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>

                {/* Collector Assignment Interface */}
                {assigningCollector === report.id && (
                  <div className="mt-3 p-3 glassmorphism rounded-lg">
                    <h6 className="font-medium text-foreground mb-2">Assign Collector</h6>
                    <div className="flex gap-2">
                      <Select 
                        onValueChange={(value) => handleAssignCollector(report.id, value)}
                      >
                        <SelectTrigger className="flex-1 glassmorphism border-0">
                          <SelectValue placeholder="Select collector" />
                        </SelectTrigger>
                        <SelectContent className="glassmorphism border-0">
                          {mockCollectors.map((collector) => (
                            <SelectItem key={collector.id} value={collector.id}>
                              {collector.name} - {collector.area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAssigningCollector(null)}
                        className="glassmorphism border-0"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Selected Report Details */}
        {selectedReport && (
          <GlassCard>
            <h4 className="font-semibold text-foreground mb-4">Report Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-semibold text-foreground capitalize">{selectedReport.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <p className={`font-semibold capitalize ${getStatusColor(selectedReport.priority)}`}>
                  {selectedReport.priority}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`font-semibold capitalize ${getStatusColor(selectedReport.status)}`}>
                  {selectedReport.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">{selectedReport.location.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reported By</p>
                <p className="font-semibold text-foreground">{selectedReport.reportedBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reported At</p>
                <p className="font-semibold text-foreground">
                  {selectedReport.reportedAt.toLocaleString()}
                </p>
              </div>
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
