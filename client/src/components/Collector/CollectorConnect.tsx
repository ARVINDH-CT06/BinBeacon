import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { mockTips, mockDistributeRequests } from "@/data/mockData";

interface CollectorConnectProps {
  onClose: () => void;
}

export function CollectorConnect({ onClose }: CollectorConnectProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/distribute-requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });

      if (response.ok) {
        toast({
          title: "Request Accepted",
          description: "You have accepted the distribution request"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive"
      });
    }
  };

  const handleIgnoreRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/distribute-requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ignored' })
      });

      if (response.ok) {
        toast({
          title: "Request Ignored",
          description: "Request has been ignored"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ignore request",
        variant: "destructive"
      });
    }
  };

  // Calculate total tips received by current collector
  const collectorTips = mockTips.filter(tip => tip.to === "Rajesh Kumar");
  const totalTips = collectorTips.reduce((sum, tip) => sum + tip.amount, 0);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('connect')}</DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glassmorphism">
          <TabsTrigger value="tips" data-testid="tips-tab">💰 Tips</TabsTrigger>
          <TabsTrigger value="distribute" data-testid="distribute-tab">📦 Requests</TabsTrigger>
        </TabsList>
        
        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          {/* Tips Summary */}
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">₹{totalTips}</div>
            <p className="text-sm text-muted-foreground">Total Tips This Month</p>
          </GlassCard>

          {/* Tips Received */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tips Received</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
              {collectorTips.map((tip) => (
                <div key={tip.id} className="flex justify-between items-center p-3 glassmorphism rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">₹{tip.amount}</p>
                    <p className="text-sm text-muted-foreground">{tip.from}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{tip.date}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Tips Summary by Amount */}
          <GlassCard>
            <h4 className="font-semibold text-foreground mb-3">Breakdown</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-500">
                  {collectorTips.filter(t => t.amount >= 50).length}
                </div>
                <div className="text-xs text-muted-foreground">₹50+ Tips</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-500">
                  {collectorTips.filter(t => t.amount >= 30 && t.amount < 50).length}
                </div>
                <div className="text-xs text-muted-foreground">₹30-49 Tips</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-500">
                  {collectorTips.filter(t => t.amount < 30).length}
                </div>
                <div className="text-xs text-muted-foreground">Under ₹30</div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Distribution Requests Tab */}
        <TabsContent value="distribute" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Distribution Requests</h3>
            <div className="space-y-3">
              {mockDistributeRequests.filter(req => req.status === 'pending').map((request) => (
                <div key={request.id} className="p-3 glassmorphism rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{request.itemType} Collection</p>
                      <p className="text-sm text-muted-foreground">From: {request.resident}</p>
                      <p className="text-sm text-muted-foreground">Address: {request.address}</p>
                    </div>
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                      New
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-primary text-primary-foreground px-3 py-1 text-sm hover:bg-primary/90"
                      data-testid={`accept-${request.id}`}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleIgnoreRequest(request.id)}
                      className="bg-muted text-muted-foreground px-3 py-1 text-sm hover:bg-muted/90"
                      data-testid={`ignore-${request.id}`}
                    >
                      Ignore
                    </Button>
                  </div>
                </div>
              ))}
              
              {mockDistributeRequests.filter(req => req.status === 'pending').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📦</div>
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <h4 className="font-semibold text-foreground mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {mockDistributeRequests.filter(req => req.status !== 'pending').slice(0, 3).map((request) => (
                <div key={request.id} className="flex justify-between items-center p-2 glassmorphism rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{request.itemType}</p>
                    <p className="text-xs text-muted-foreground">{request.resident}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    request.status === 'accepted' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Close Button */}
      <Button onClick={onClose} variant="outline" className="w-full glassmorphism border-0 mt-4">
        Close
      </Button>
    </>
  );
}
