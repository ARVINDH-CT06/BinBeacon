import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glassmorphism";
import { Header } from "@/components/Layout/Header";
import { useLanguage } from "@/hooks/use-language";
import { useVoice } from "@/hooks/use-voice";
import { useApp } from "@/contexts/AppContext";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { speak } = useVoice();
  const { login } = useApp();

  const handleRoleSelection = (role: string) => {
    setLocation(`/register/${role}`);
  };

  const handleDemoLogin = async (role: 'resident' | 'collector' | 'authority') => {
    try {
      // Demo login with mock credentials
      const demoCredentials = {
        resident: { phone: '+919876543210', password: 'resident123' },
        collector: { phone: '+919876543211', password: 'garbage23' },
        authority: { phone: '+914423456789', password: 'authority123' }
      };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoCredentials[role])
      });

      if (response.ok) {
        const { user, profile } = await response.json();
        login(user, profile);
        speak('voice-welcome');
        setLocation(`/${role}`);
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Header />
      
      <GlassCard className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
            <div className="w-20 h-20 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-primary-foreground">
                {/* Truck shape */}
                <rect x="20" y="40" width="40" height="20" fill="currentColor" rx="5"/>
                <rect x="50" y="35" width="15" height="15" fill="currentColor" rx="3"/>
                {/* Wheels */}
                <circle cx="30" cy="65" r="5" fill="currentColor"/>
                <circle cx="55" cy="65" r="5" fill="currentColor"/>
                {/* Leaves on top */}
                <ellipse cx="35" cy="25" rx="6" ry="8" fill="hsl(var(--accent))" transform="rotate(-15 35 25)"/>
                <ellipse cx="45" cy="22" rx="5" ry="7" fill="hsl(var(--accent))" transform="rotate(10 45 22)"/>
                <ellipse cx="55" cy="25" rx="4" ry="6" fill="hsl(var(--accent))" transform="rotate(25 55 25)"/>
                {/* Recycle symbol */}
                <circle cx="40" cy="80" r="8" fill="none" stroke="hsl(var(--accent))" strokeWidth="2"/>
                <path d="M35 77 L40 85 L45 77" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          {t('app-title')}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12">
          {t('tagline')}
        </p>

        {/* Role Selection Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={() => handleRoleSelection('resident')} 
            className="glassmorphism rounded-2xl p-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 group"
            data-testid="select-resident"
          >
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">{t('resident')}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground">{t('resident-desc')}</p>
          </button>
          
          <button 
            onClick={() => handleRoleSelection('collector')} 
            className="glassmorphism rounded-2xl p-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 group"
            data-testid="select-collector"
          >
            <div className="text-6xl mb-4">🚛</div>
            <h3 className="text-xl font-semibold mb-2">{t('collector')}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground">{t('collector-desc')}</p>
          </button>
          
          <button 
            onClick={() => handleRoleSelection('authority')} 
            className="glassmorphism rounded-2xl p-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 group"
            data-testid="select-authority"
          >
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-2">{t('authority')}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground">{t('authority-desc')}</p>
          </button>
        </div>

        {/* Demo Login Section */}
        <GlassCard className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Demo Login</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              onClick={() => handleDemoLogin('resident')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="demo-resident"
            >
              Demo Resident
            </Button>
            <Button 
              onClick={() => handleDemoLogin('collector')}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-testid="demo-collector"
            >
              Demo Collector
            </Button>
            <Button 
              onClick={() => handleDemoLogin('authority')}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="demo-authority"
            >
              Demo Authority
            </Button>
          </div>
        </GlassCard>
      </GlassCard>
    </div>
  );
}
