import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { mockFeedback, mockCollectors } from "@/data/mockData";

interface FeedbackViewerProps {
  onClose: () => void;
}

export function FeedbackViewer({ onClose }: FeedbackViewerProps) {
  const { t } = useLanguage();
  const [selectedCollector, setSelectedCollector] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Filter feedback based on selected filters
  const filteredFeedback = mockFeedback.filter(feedback => {
    const matchesCollector = selectedCollector === "all" || feedback.collector === selectedCollector;
    const matchesRating = ratingFilter === "all" || 
      (ratingFilter === "high" && feedback.rating >= 4) ||
      (ratingFilter === "medium" && feedback.rating === 3) ||
      (ratingFilter === "low" && feedback.rating <= 2);
    
    return matchesCollector && matchesRating;
  });

  // Calculate statistics
  const totalFeedback = mockFeedback.length;
  const averageRating = mockFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;
  
  const ratingDistribution = {
    5: mockFeedback.filter(f => f.rating === 5).length,
    4: mockFeedback.filter(f => f.rating === 4).length,
    3: mockFeedback.filter(f => f.rating === 3).length,
    2: mockFeedback.filter(f => f.rating === 2).length,
    1: mockFeedback.filter(f => f.rating === 1).length
  };

  // Collector performance summary
  const collectorPerformance = mockCollectors.map(collector => {
    const collectorFeedbacks = mockFeedback.filter(f => f.collector === collector.name);
    const avgRating = collectorFeedbacks.length > 0 
      ? collectorFeedbacks.reduce((sum, f) => sum + f.rating, 0) / collectorFeedbacks.length 
      : 0;
    
    return {
      ...collector,
      feedbackCount: collectorFeedbacks.length,
      averageRating: avgRating,
      recentFeedbacks: collectorFeedbacks.slice(0, 3)
    };
  }).sort((a, b) => b.averageRating - a.averageRating);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }[size];

    return (
      <div className={`flex ${sizeClass}`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span 
            key={i} 
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('feedback-viewer')}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Feedback</h4>
            <p className="text-2xl font-bold text-foreground">{totalFeedback}</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Rating</h4>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</p>
              {renderStars(Math.round(averageRating), 'md')}
            </div>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Positive Reviews</h4>
            <p className="text-2xl font-bold text-green-500">
              {Math.round((ratingDistribution[4] + ratingDistribution[5]) / totalFeedback * 100)}%
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Need Improvement</h4>
            <p className="text-2xl font-bold text-red-500">
              {Math.round((ratingDistribution[1] + ratingDistribution[2]) / totalFeedback * 100)}%
            </p>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Collector</label>
            <Select value={selectedCollector} onValueChange={setSelectedCollector}>
              <SelectTrigger className="glassmorphism border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glassmorphism border-0">
                <SelectItem value="all">All Collectors</SelectItem>
                {mockCollectors.map((collector) => (
                  <SelectItem key={collector.id} value={collector.name}>
                    {collector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Rating</label>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="glassmorphism border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glassmorphism border-0">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="high">High (4-5 stars)</SelectItem>
                <SelectItem value="medium">Medium (3 stars)</SelectItem>
                <SelectItem value="low">Low (1-2 stars)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rating Distribution */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-4">Rating Distribution</h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-16">
                  <span className="text-sm font-medium text-foreground">{star}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-green-500' : 
                        star >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(ratingDistribution[star] / totalFeedback) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="min-w-12 text-right">
                  <span className="text-sm font-medium text-foreground">
                    {ratingDistribution[star]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Performers */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-4">Collector Performance</h4>
          <div className="space-y-3">
            {collectorPerformance.slice(0, 5).map((collector, index) => (
              <div key={collector.id} className="p-3 glassmorphism rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-yellow-600' : 'bg-muted'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{collector.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {collector.area} • {collector.feedbackCount} reviews
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(collector.averageRating), 'md')}
                    <span className={`font-bold text-lg ${getRatingColor(collector.averageRating)}`}>
                      {collector.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Feedback List */}
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-foreground">
              Recent Feedback ({filteredFeedback.length})
            </h4>
            <Button
              size="sm"
              variant="outline"
              className="glassmorphism border-0"
              onClick={() => {
                setSelectedCollector("all");
                setRatingFilter("all");
              }}
              data-testid="clear-filters"
            >
              Clear Filters
            </Button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
            {filteredFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 glassmorphism rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-semibold text-foreground">{feedback.collector}</h5>
                    <p className="text-sm text-muted-foreground">
                      Feedback by: {feedback.resident}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {renderStars(feedback.rating, 'md')}
                    <p className="text-xs text-muted-foreground mt-1">{feedback.date}</p>
                  </div>
                </div>
                
                <p className="text-foreground bg-muted/20 rounded-lg p-3 italic">
                  "{feedback.comment}"
                </p>
                
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="glassmorphism border-0 text-xs"
                    data-testid={`respond-${feedback.id}`}
                  >
                    📧 Respond
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glassmorphism border-0 text-xs"
                    data-testid={`flag-${feedback.id}`}
                  >
                    🚩 Flag
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glassmorphism border-0 text-xs"
                    data-testid={`share-${feedback.id}`}
                  >
                    📤 Share
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredFeedback.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">💭</div>
                <p>No feedback matches the selected filters</p>
              </div>
            )}
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
