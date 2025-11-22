import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { mockCollectors, mockFeedback } from "@/data/mockData";

interface FeedbackProps {
  onClose: () => void;
  onEmergency: () => void;
}

export function Feedback({ onClose, onEmergency }: FeedbackProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCollector, setSelectedCollector] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedCollector || rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a collector and provide a rating",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId: 'resident-1',
          collectorId: selectedCollector,
          rating,
          comment
        })
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted",
          description: t('feedback-submitted')
        });
        setSelectedCollector("");
        setRating(0);
        setComment("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      });
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      return (
        <button
          key={starNumber}
          onClick={() => handleRatingClick(starNumber)}
          className={`text-3xl transition-all hover:scale-110 ${
            starNumber <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          data-testid={`star-${starNumber}`}
        >
          ★
        </button>
      );
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('feedback')} & {t('emergency')}</DialogTitle>
      </DialogHeader>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Feedback Form */}
        <GlassCard>
          <h3 className="text-xl font-semibold text-foreground mb-4">Give Feedback</h3>
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
                Rating
              </label>
              <div className="flex gap-2 justify-center py-2">
                {renderStars()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Comments (Optional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your feedback..."
                rows={3}
                className="glassmorphism border-0"
                data-testid="feedback-comment"
              />
            </div>

            <Button 
              onClick={handleSubmitFeedback}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="submit-feedback-button"
            >
              Submit Feedback
            </Button>
          </div>
        </GlassCard>

        {/* Emergency */}
        <GlassCard>
          <h3 className="text-xl font-semibold text-destructive mb-4">{t('emergency')}</h3>
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">🚨</div>
            <p className="text-muted-foreground">Report waste-related emergencies</p>
            
            <div className="glassmorphism rounded-lg p-4 text-left">
              <p className="text-sm text-muted-foreground mb-2">Emergency types:</p>
              <ul className="text-sm text-foreground space-y-1">
                <li>• Overflowing waste causing health hazards</li>
                <li>• Blocked waste collection routes</li>
                <li>• Urgent waste disposal needed</li>
                <li>• Environmental contamination</li>
              </ul>
            </div>
            
            <Button 
              onClick={onEmergency}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-lg font-semibold py-4 w-full"
              data-testid="emergency-button"
            >
              🚨 REPORT EMERGENCY
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Recent Feedback */}
      <GlassCard className="mt-6">
        <h4 className="font-semibold text-foreground mb-3">Recent Feedback</h4>
        <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-hide">
          {mockFeedback.slice(0, 3).map((feedback) => (
            <div key={feedback.id} className="p-3 glassmorphism rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-foreground">{feedback.collector}</p>
                  <p className="text-sm text-muted-foreground">By {feedback.resident}</p>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span 
                      key={i} 
                      className={`text-lg ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Close Button */}
      <Button onClick={onClose} variant="outline" className="w-full glassmorphism border-0 mt-4">
        Close
      </Button>
    </>
  );
}
