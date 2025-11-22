import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { mockTips, mockCollectors } from "@/data/mockData";

interface TipsAnalyticsProps {
  onClose: () => void;
}

export function TipsAnalytics({ onClose }: TipsAnalyticsProps) {
  const { t } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");

  // Calculate analytics
  const totalTips = mockTips.reduce((sum, tip) => sum + tip.amount, 0);
  const totalTransactions = mockTips.length;
  const averageTip = totalTips / totalTransactions;

  // Top collectors by tips
  const collectorTips = mockCollectors.map(collector => {
    const collectorTipData = mockTips.filter(tip => tip.to === collector.name);
    const totalReceived = collectorTipData.reduce((sum, tip) => sum + tip.amount, 0);
    const transactionCount = collectorTipData.length;
    
    return {
      ...collector,
      totalTips: totalReceived,
      transactionCount,
      averageTip: transactionCount > 0 ? totalReceived / transactionCount : 0
    };
  }).sort((a, b) => b.totalTips - a.totalTips);

  // Tips by amount range
  const tipRanges = {
    small: mockTips.filter(tip => tip.amount < 30).length,
    medium: mockTips.filter(tip => tip.amount >= 30 && tip.amount < 75).length,
    large: mockTips.filter(tip => tip.amount >= 75).length
  };

  // Daily breakdown (mock)
  const dailyTips = [
    { day: "Mon", amount: 450, transactions: 12 },
    { day: "Tue", amount: 320, transactions: 8 },
    { day: "Wed", amount: 680, transactions: 15 },
    { day: "Thu", amount: 280, transactions: 6 },
    { day: "Fri", amount: 520, transactions: 11 },
    { day: "Sat", amount: 720, transactions: 18 },
    { day: "Sun", amount: 380, transactions: 9 }
  ];

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('tips-analytics')}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Overview Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Tips</h4>
            <p className="text-2xl font-bold text-primary">₹{totalTips.toLocaleString()}</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Transactions</h4>
            <p className="text-2xl font-bold text-accent">{totalTransactions}</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Tip</h4>
            <p className="text-2xl font-bold text-secondary">₹{Math.round(averageTip)}</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Givers</h4>
            <p className="text-2xl font-bold text-foreground">
              {new Set(mockTips.map(tip => tip.from)).size}
            </p>
          </GlassCard>
        </div>

        <Tabs defaultValue="collectors" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glassmorphism">
            <TabsTrigger value="collectors" data-testid="collectors-tab">Top Collectors</TabsTrigger>
            <TabsTrigger value="trends" data-testid="trends-tab">Trends</TabsTrigger>
            <TabsTrigger value="breakdown" data-testid="breakdown-tab">Breakdown</TabsTrigger>
          </TabsList>
          
          {/* Top Collectors Tab */}
          <TabsContent value="collectors" className="space-y-4">
            <GlassCard>
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Collectors</h3>
              <div className="space-y-3">
                {collectorTips.slice(0, 5).map((collector, index) => (
                  <div key={collector.id} className="p-4 glassmorphism rounded-lg">
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
                          <h4 className="font-semibold text-foreground">{collector.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {collector.area} • {collector.transactionCount} tips
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-accent">₹{collector.totalTips}</div>
                        <div className="text-sm text-muted-foreground">
                          Avg: ₹{Math.round(collector.averageTip)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Performance Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Performance</span>
                        <span className={getPerformanceColor((collector.totalTips / collectorTips[0]?.totalTips) * 100)}>
                          {Math.round((collector.totalTips / collectorTips[0]?.totalTips) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${(collector.totalTips / collectorTips[0]?.totalTips) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <GlassCard>
              <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Trends</h3>
              <div className="space-y-3">
                {dailyTips.map((day) => (
                  <div key={day.day} className="p-3 glassmorphism rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-foreground">{day.day}</h4>
                        <p className="text-sm text-muted-foreground">
                          {day.transactions} transactions
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${(day.amount / Math.max(...dailyTips.map(d => d.amount))) * 100}%` }}
                          />
                        </div>
                        <div className="text-right min-w-16">
                          <div className="font-bold text-foreground">₹{day.amount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
            
            <GlassCard>
              <h4 className="font-semibold text-foreground mb-3">Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">📈</span>
                  <span className="text-foreground">Peak tipping day: Saturday</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">⏰</span>
                  <span className="text-foreground">Average response time: 2.3 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-foreground">Most generous area: Anna Nagar</span>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Tip Amount Distribution */}
              <GlassCard>
                <h3 className="text-lg font-semibold text-foreground mb-4">Tip Amount Distribution</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-foreground font-medium">Small (Under ₹30)</span>
                      <p className="text-sm text-muted-foreground">{tipRanges.small} tips</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full" 
                          style={{ width: `${(tipRanges.small / totalTransactions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((tipRanges.small / totalTransactions) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-foreground font-medium">Medium (₹30-75)</span>
                      <p className="text-sm text-muted-foreground">{tipRanges.medium} tips</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-3">
                        <div 
                          className="bg-yellow-500 h-3 rounded-full" 
                          style={{ width: `${(tipRanges.medium / totalTransactions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((tipRanges.medium / totalTransactions) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-foreground font-medium">Large (₹75+)</span>
                      <p className="text-sm text-muted-foreground">{tipRanges.large} tips</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full" 
                          style={{ width: `${(tipRanges.large / totalTransactions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((tipRanges.large / totalTransactions) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              {/* Recent Large Tips */}
              <GlassCard>
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Large Tips</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                  {mockTips
                    .filter(tip => tip.amount >= 50)
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 6)
                    .map((tip) => (
                      <div key={tip.id} className="p-3 glassmorphism rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-foreground">₹{tip.amount}</p>
                            <p className="text-sm text-muted-foreground">{tip.from} → {tip.to}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{tip.date}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </GlassCard>
            </div>

            {/* All Transactions */}
            <GlassCard>
              <h4 className="font-semibold text-foreground mb-3">All Transactions</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                {mockTips.map((tip) => (
                  <div key={tip.id} className="flex justify-between items-center p-2 glassmorphism rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm text-foreground">{tip.from} → {tip.to}</span>
                    </div>
                    <div className="text-center min-w-16">
                      <span className="text-sm font-medium text-accent">₹{tip.amount}</span>
                    </div>
                    <div className="text-right min-w-20">
                      <span className="text-xs text-muted-foreground">{tip.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* Close Button */}
        <Button onClick={onClose} variant="outline" className="w-full glassmorphism border-0">
          Close
        </Button>
      </div>
    </>
  );
}
