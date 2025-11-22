import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glassmorphism";
import { Header } from "@/components/Layout/Header";
import { TruckTracking } from "@/components/Authority/TruckTracking";
import { OverflowManagement } from "@/components/Authority/OverflowManagement";
import { TipsAnalytics } from "@/components/Authority/TipsAnalytics";
import { ManageCollectors } from "@/components/Authority/ManageCollectors";
import { FeedbackViewer } from "@/components/Authority/FeedbackViewer";
import { Broadcast } from "@/components/Authority/Broadcast";
import { useLanguage } from "@/hooks/use-language";
import { useApp } from "@/contexts/AppContext";
import type { Authority } from "@/types";

export default function AuthorityDashboard() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user, profile, logout } = useApp();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const authorityProfile = profile as Authority;

  if (!user || !authorityProfile) {
    setLocation('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const openFeature = (feature: string) => {
    setActiveFeature(feature);
  };

  const closeFeature = () => {
    setActiveFeature(null);
  };

  const renderFeatureModal = () => {
    if (!activeFeature) return null;

    const featureComponents = {
      tracking: <TruckTracking onClose={closeFeature} />,
      overflow: <OverflowManagement onClose={closeFeature} />,
      analytics: <TipsAnalytics onClose={closeFeature} />,
      collectors: <ManageCollectors onClose={closeFeature} />,
      feedback: <FeedbackViewer onClose={closeFeature} />,
      broadcast: <Broadcast onClose={closeFeature} />
    };

    return (
      <Dialog open={!!activeFeature} onOpenChange={closeFeature}>
        <DialogContent className="glassmorphism border-0 max-w-4xl max-h-[90vh] overflow-y-auto">
          {featureComponents[activeFeature as keyof typeof featureComponents]}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen p-4">
      <Header />
      
      {/* Dashboard Header */}
      <GlassCard className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-2xl text-primary-foreground cursor-pointer glassmorphism border-0"
              data-testid="profile-button"
            >
              🏢
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Municipal Authority</h1>
              <p className="text-muted-foreground">{authorityProfile.authorityName}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <GlassCard className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Trucks</h3>
          <p className="text-3xl font-bold text-foreground">12</p>
        </GlassCard>
        <GlassCard className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Overflow Reports</h3>
          <p className="text-3xl font-bold text-foreground">3</p>
        </GlassCard>
        <GlassCard className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Tips</h3>
          <p className="text-3xl font-bold text-foreground">₹2,450</p>
        </GlassCard>
        <GlassCard className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Collectors</h3>
          <p className="text-3xl font-bold text-foreground">8</p>
        </GlassCard>
      </div>

      {/* Management Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Truck Tracking */}
        <button 
          onClick={() => openFeature('tracking')}
          className="glassmorphism rounded-xl p-6 cursor-pointer hover:scale-105 transition-all group text-left"
          data-testid="feature-tracking"
        >
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
            <div className="text-white text-2xl">🚛</div>
          </div>
          <h3 className="font-semibold text-foreground mb-2">{t('truck-tracking')}</h3>
          <p className="text-sm text-muted-foreground">{t('monitor-fleet')}</p>
        </button>

        {/* Overflow Reports */}
        <button 
          onClick={() => openFeature('overflow')}
          className="glassmorphism rounded-xl p-6 cursor-pointer hover:scale-105 transition-all group text-left"
          data-testid="feature-overflow"
        >
          <div className="w-12 h-12 bg-destructive rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
            <div className="text-white text-2xl">⚠️</div>
          </div>
          <h3 className="font-semibold text-foreground mb-2">Overflow Management</h3>
          <p className="text-sm text-muted-foreground">View all reports</p>
        </button>

        {/* Tips Analytics */}
        <button 
          onClick={() => openFeature('analytics')}
          className="glassmorphism rounded-xl p-6 cursor-pointer hover:scale-105 transition-all group text-left"
          data-testid="feature-analytics"
        >
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
            <div className="text-white text-2xl">💰</div>
          </div>
          <h3 className="font-semibold text-foreground mb-2">{t('tips-analytics')}</h3>
          <p className="text-sm text-muted-foreground">{t('view-transactions')}</p>
        </button>

        {/* Manage Collectors */}
        <button 
          onClick={() => openFeature('collectors')}
          className="glassmorphism rounded-xl p-6 cursor-pointer hover:scale-105 transition-all group text-left"
          data-testid="feature-collectors"
        >
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
            <div className="text-white text-2xl">👥</div>
          </div>
          <h3 className="font-semibold text-foreground mb-2">{t('manage-collectors')}</h3>
          <p className="text-sm text-muted-foreground">{t('add-remove-staff')}</p>
        </button>

        {/* Feedback Viewer */}
        <button 
          onClick={() => openFeature('feedback')}
          className="glassmorphism rounded-xl p-6 cursor-pointer hover:scale-105 transition-all group text-left"
          data-testid="feature-feedback"
        >
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
            <div className="text-white text-2xl">⭐</div>
          </div>
          <h3 className="font-semibold text-foreground mb-2">{t('feedback-viewer')}</h3>
          <p className="text-sm text-muted-foreground">{t('resident-feedback')}</p>
        </button>

        {/* Broadcast Messages */}
        <button 
          onClick={() => openFeature('broadcast')}
          className="glassmorphism rounded-xl p-6 cursor-pointer hover:scale-105 transition-all group text-left"
          data-testid="feature-broadcast"
        >
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
            <div className="text-white text-2xl">📢</div>
          </div>
          <h3 className="font-semibold text-foreground mb-2">{t('broadcast')}</h3>
          <p className="text-sm text-muted-foreground">{t('send-messages')}</p>
        </button>
      </div>

      {/* Feature Modals */}
      {renderFeatureModal()}
    </div>
  );
}
