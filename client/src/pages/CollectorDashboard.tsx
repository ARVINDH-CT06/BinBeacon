import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glassmorphism";
import { Header } from "@/components/Layout/Header";
import { Dumps } from "@/components/Collector/Dumps";
import { Alerts } from "@/components/Collector/Alerts";
import { CollectorConnect } from "@/components/Collector/CollectorConnect";
import { useLanguage } from "@/hooks/use-language";
import { useApp } from "@/contexts/AppContext";
import type { Collector } from "@/types";

export default function CollectorDashboard() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user, profile, logout } = useApp();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const collectorProfile = profile as Collector;

  if (!user || !collectorProfile) {
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
      dumps: <Dumps onClose={closeFeature} />,
      alerts: <Alerts onClose={closeFeature} />,
      connect: <CollectorConnect onClose={closeFeature} />
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
              className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-2xl text-primary-foreground cursor-pointer glassmorphism border-0"
              data-testid="profile-button"
            >
              👨‍💼
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Collector Dashboard</h1>
              <p className="text-muted-foreground">
                {user.name} - ID: {collectorProfile.employeeId}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Collection Progress</span>
              <span>{collectorProfile.collectionProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500" 
                style={{ width: `${collectorProfile.collectionProgress}%` }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Dumps */}
        <button 
          onClick={() => openFeature('dumps')}
          className="glassmorphism rounded-2xl p-6 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer transform hover:scale-105 group text-left"
          data-testid="feature-dumps"
        >
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold mb-2">{t('dumps')}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-primary-foreground">
            {t('manage-collections')}
          </p>
        </button>

        {/* Alerts */}
        <button 
          onClick={() => openFeature('alerts')}
          className="glassmorphism rounded-2xl p-6 hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer transform hover:scale-105 group text-left"
          data-testid="feature-alerts"
        >
          <div className="text-4xl mb-4">🚨</div>
          <h3 className="text-xl font-semibold mb-2">{t('alerts')}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
            {t('overflow-reports')}
          </p>
        </button>

        {/* Connect */}
        <button 
          onClick={() => openFeature('connect')}
          className="glassmorphism rounded-2xl p-6 hover:bg-secondary hover:text-secondary-foreground transition-all cursor-pointer transform hover:scale-105 group text-left"
          data-testid="feature-connect"
        >
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">{t('connect')}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-secondary-foreground">
            Tips & Chats
          </p>
        </button>
      </div>

      {/* Recent Activity */}
      <GlassCard>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 glassmorphism rounded-lg">
            <div>
              <p className="font-medium text-foreground">House DR001 - Collected</p>
              <p className="text-sm text-muted-foreground">Anna Nagar, 2 hours ago</p>
            </div>
            <span className="text-green-500 font-medium">✓</span>
          </div>
          <div className="flex items-center justify-between p-3 glassmorphism rounded-lg">
            <div>
              <p className="font-medium text-foreground">Tip Received - ₹50</p>
              <p className="text-sm text-muted-foreground">From DR001, 3 hours ago</p>
            </div>
            <span className="text-accent font-medium">₹50</span>
          </div>
          <div className="flex items-center justify-between p-3 glassmorphism rounded-lg">
            <div>
              <p className="font-medium text-foreground">Overflow Alert</p>
              <p className="text-sm text-muted-foreground">T Nagar junction, 5 hours ago</p>
            </div>
            <span className="text-destructive font-medium">!</span>
          </div>
        </div>
      </GlassCard>

      {/* Feature Modals */}
      {renderFeatureModal()}
    </div>
  );
}
