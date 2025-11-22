import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { mockCollectors, mockTips, mockChats, mockDistributeRequests } from "@/data/mockData";

interface ConnectProps {
  onClose: () => void;
}

export function Connect({ onClose }: ConnectProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [selectedCollector, setSelectedCollector] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");

  const handleSendTip = async () => {
    if (!selectedCollector || !tipAmount) {
      toast({
        title: "Missing Information",
        description: "Please select collector and tip amount",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromResidentId: 'resident-1',
          toCollectorId: selectedCollector,
          amount: parseInt(tipAmount)
        })
      });

      if (response.ok) {
        toast({
          title: "Tip Sent",
          description: t('tip-sent')
        });
        setTipAmount("");
        setSelectedCollector("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send tip",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: 'user-resident-1',
          receiverId: selectedCollector || null,
          message: newMessage,
          chatType: selectedCollector ? 'private' : 'group'
        })
      });

      if (response.ok) {
        setNewMessage("");
        toast({
          title: "Message Sent",
          description: "Your message has been sent"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleDistributeRequest = async () => {
    if (!selectedItemType) {
      toast({
        title: "Missing Information",
        description: "Please select an item type",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/distribute-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId: 'resident-1',
          itemType: selectedItemType
        })
      });

      if (response.ok) {
        toast({
          title: "Request Sent",
          description: "Your distribution request has been sent to collectors"
        });
        setSelectedItemType("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request",
        variant: "destructive"
      });
    }
  };

  const itemTypes = [
    "Old Clothes",
    "Old Toys", 
    "Extra Food",
    "Electronics",
    "Books",
    "Furniture"
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('connect')}</DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glassmorphism">
          <TabsTrigger value="tips" data-testid="tips-tab">💰 Tips</TabsTrigger>
          <TabsTrigger value="chats" data-testid="chats-tab">💬 Chats</TabsTrigger>
          <TabsTrigger value="distribute" data-testid="distribute-tab">📦 Distribute</TabsTrigger>
        </TabsList>
        
        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Send Tips</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Collector
                </label>
                <Select value={selectedCollector} onValueChange={setSelectedCollector}>
                  <SelectTrigger className="glassmorphism border-0">
                    <SelectValue placeholder="Choose a collector" />
                  </SelectTrigger>
                  <SelectContent className="glassmorphism border-0">
                    {mockCollectors.map((collector) => (
                      <SelectItem key={collector.id} value={collector.id}>
                        {collector.name} - {collector.area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tip Amount (₹)
                </label>
                <Input
                  type="number"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="glassmorphism border-0"
                  data-testid="tip-amount-input"
                />
              </div>

              <Button 
                onClick={handleSendTip}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="send-tip-button"
              >
                Send Tip
              </Button>
            </div>
          </GlassCard>

          {/* Recent Tips */}
          <GlassCard>
            <h4 className="font-semibold text-foreground mb-3">Recent Tips</h4>
            <div className="space-y-2">
              {mockTips.slice(0, 3).map((tip) => (
                <div key={tip.id} className="flex justify-between items-center p-2 glassmorphism rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">₹{tip.amount}</p>
                    <p className="text-xs text-muted-foreground">To {tip.to}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{tip.date}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Chats Tab */}
        <TabsContent value="chats" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Chat Messages</h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide mb-4">
              {mockChats.map((chat) => (
                <div key={chat.id} className="p-3 glassmorphism rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-foreground">{chat.sender}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm text-foreground">{chat.message}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    chat.type === 'group' 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {chat.type}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 glassmorphism border-0"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                data-testid="chat-input"
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="send-message-button"
              >
                Send
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Distribute Tab */}
        <TabsContent value="distribute" className="space-y-4">
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Request Item Collection</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Item Type
                </label>
                <Select value={selectedItemType} onValueChange={setSelectedItemType}>
                  <SelectTrigger className="glassmorphism border-0">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent className="glassmorphism border-0">
                    {itemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleDistributeRequest}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                data-testid="request-collection-button"
              >
                Request Collection
              </Button>
            </div>
          </GlassCard>

          {/* Recent Requests */}
          <GlassCard>
            <h4 className="font-semibold text-foreground mb-3">Your Requests</h4>
            <div className="space-y-2">
              {mockDistributeRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="p-3 glassmorphism rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{request.itemType}</p>
                      <p className="text-sm text-muted-foreground">{request.address}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'pending' 
                        ? 'bg-yellow-500 text-white' 
                        : request.status === 'accepted'
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {request.status}
                    </span>
                  </div>
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
