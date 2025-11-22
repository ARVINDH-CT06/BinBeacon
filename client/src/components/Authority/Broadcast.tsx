import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { useVoice } from "@/hooks/use-voice";
import { useToast } from "@/hooks/use-toast";
import { mockBroadcasts } from "@/data/mockData";

interface BroadcastProps {
  onClose: () => void;
}

const broadcastSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters long"),
  targetAudience: z.string().min(1, "Please select target audience"),
  priority: z.string().min(1, "Please select priority level"),
  includeVoice: z.boolean().default(false)
});

export function Broadcast({ onClose }: BroadcastProps) {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState(mockBroadcasts);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      message: "",
      targetAudience: "",
      priority: "",
      includeVoice: false
    }
  });

  const watchedMessage = form.watch('message');
  const watchedTargetAudience = form.watch('targetAudience');

  const handleSendBroadcast = async (data: any) => {
    try {
      const newBroadcast = {
        id: `broadcast-${Date.now()}`,
        authorityId: 'authority-1',
        message: data.message,
        targetAudience: data.targetAudience,
        priority: data.priority,
        includeVoice: data.includeVoice,
        sentAt: new Date(),
        recipientCount: getRecipientCount(data.targetAudience)
      };

      const response = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBroadcast)
      });

      if (response.ok) {
        setBroadcasts(prev => [newBroadcast, ...prev]);
        
        // Voice announcement if enabled
        if (data.includeVoice) {
          speak('broadcast-sent', `Broadcast message sent to ${data.targetAudience}`);
        }

        toast({
          title: "Broadcast Sent Successfully!",
          description: `Message sent to ${newBroadcast.recipientCount} ${data.targetAudience}`,
        });

        form.reset();
        setPreviewMode(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send broadcast message",
        variant: "destructive"
      });
    }
  };

  const getRecipientCount = (audience: string) => {
    switch (audience) {
      case 'all': return 156;
      case 'residents': return 120;
      case 'collectors': return 28;
      case 'authorities': return 8;
      default: return 0;
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  };

  const presetMessages = [
    {
      title: "Schedule Update",
      message: "Important: Collection schedule has been updated for this week. Please check your area timing.",
      audience: "residents",
      priority: "medium"
    },
    {
      title: "Holiday Notice",
      message: "No waste collection on Republic Day (26th Jan). Next collection will resume on 27th Jan.",
      audience: "all",
      priority: "high"
    },
    {
      title: "Route Change",
      message: "Due to road maintenance, collection routes in Anna Nagar have been temporarily modified.",
      audience: "collectors",
      priority: "medium"
    },
    {
      title: "Appreciation Message",
      message: "Thank you for maintaining excellent waste disposal practices. Your efforts help keep Chennai clean!",
      audience: "residents",
      priority: "low"
    }
  ];

  const loadPresetMessage = (preset: any) => {
    form.setValue('message', preset.message);
    form.setValue('targetAudience', preset.audience);
    form.setValue('priority', preset.priority);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('broadcast')} Messages</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {!previewMode ? (
          <>
            {/* Broadcast Form */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-foreground mb-4">Compose New Broadcast</h3>
              
              {/* Preset Messages */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Quick Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  {presetMessages.map((preset, index) => (
                    <Button
                      key={index}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => loadPresetMessage(preset)}
                      className="glassmorphism border-0 text-xs text-left h-auto p-2"
                      data-testid={`preset-${index}`}
                    >
                      <div>
                        <div className="font-medium">{preset.title}</div>
                        <div className="text-muted-foreground truncate">{preset.message.substring(0, 40)}...</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendBroadcast)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broadcast Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="glassmorphism border-0 min-h-32" 
                            placeholder="Type your broadcast message here..."
                            data-testid="broadcast-message-input"
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className={`text-xs ${
                            field.value.length > 200 ? 'text-red-500' : 'text-muted-foreground'
                          }`}>
                            {field.value.length}/500 characters
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="glassmorphism border-0">
                                <SelectValue placeholder="Select audience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glassmorphism border-0">
                              <SelectItem value="all">All Users ({getRecipientCount('all')})</SelectItem>
                              <SelectItem value="residents">Residents Only ({getRecipientCount('residents')})</SelectItem>
                              <SelectItem value="collectors">Collectors Only ({getRecipientCount('collectors')})</SelectItem>
                              <SelectItem value="authorities">Authorities Only ({getRecipientCount('authorities')})</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="glassmorphism border-0">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glassmorphism border-0">
                              <SelectItem value="high">🚨 High Priority</SelectItem>
                              <SelectItem value="medium">⚠️ Medium Priority</SelectItem>
                              <SelectItem value="low">ℹ️ Low Priority</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="includeVoice"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="include-voice-checkbox"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include Voice Announcement</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Send voice notification along with text message
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      disabled={!watchedMessage || !watchedTargetAudience}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      data-testid="preview-broadcast"
                    >
                      👁️ Preview
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      data-testid="send-broadcast-button"
                    >
                      📢 Send Broadcast
                    </Button>
                  </div>
                </form>
              </Form>
            </GlassCard>
          </>
        ) : (
          /* Preview Mode */
          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Broadcast Preview</h3>
              <Button
                onClick={() => setPreviewMode(false)}
                variant="outline"
                size="sm"
                className="glassmorphism border-0"
              >
                ← Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 glassmorphism rounded-lg border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getPriorityIcon(form.getValues('priority'))}</span>
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(form.getValues('priority'))}`}>
                    {form.getValues('priority').toUpperCase()} PRIORITY
                  </span>
                </div>
                <p className="text-foreground text-lg leading-relaxed">{watchedMessage}</p>
                <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground">
                  <span>To: {getRecipientCount(watchedTargetAudience)} {watchedTargetAudience}</span>
                  <span>Chennai Municipal Authority</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={form.handleSubmit(handleSendBroadcast)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="confirm-send-broadcast"
                >
                  ✅ Confirm & Send
                </Button>
                <Button 
                  onClick={() => setPreviewMode(false)}
                  variant="outline"
                  className="glassmorphism border-0"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Broadcast History */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-4">Recent Broadcasts ({broadcasts.length})</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
            {broadcasts.map((broadcast) => (
              <div key={broadcast.id} className="p-3 glassmorphism rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(broadcast.priority || 'medium')}`}>
                      {(broadcast.priority || 'medium').toUpperCase()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      To: {broadcast.targetAudience}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {broadcast.sentAt.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-foreground">{broadcast.message}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Sent to {broadcast.recipientCount || getRecipientCount(broadcast.targetAudience)} recipients
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="glassmorphism border-0 h-6 px-2 text-xs"
                      data-testid={`resend-${broadcast.id}`}
                    >
                      🔄 Resend
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="glassmorphism border-0 h-6 px-2 text-xs"
                      data-testid={`delete-${broadcast.id}`}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {broadcasts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">📢</div>
                <p>No broadcasts sent yet</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Sent</h4>
            <p className="text-2xl font-bold text-foreground">{broadcasts.length}</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">This Week</h4>
            <p className="text-2xl font-bold text-primary">
              {broadcasts.filter(b => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return b.sentAt >= weekAgo;
              }).length}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">High Priority</h4>
            <p className="text-2xl font-bold text-red-500">
              {broadcasts.filter(b => b.priority === 'high').length}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Recipients</h4>
            <p className="text-2xl font-bold text-accent">
              {broadcasts.reduce((sum, b) => sum + (b.recipientCount || getRecipientCount(b.targetAudience)), 0)}
            </p>
          </GlassCard>
        </div>

        {/* Close Button */}
        <Button onClick={onClose} variant="outline" className="w-full glassmorphism border-0">
          Close
        </Button>
      </div>
    </>
  );
}
