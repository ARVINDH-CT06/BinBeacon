import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "./StatusIndicator";
import { useLanguage } from "@/hooks/use-language";
import { User, Resident } from "@/types";

interface ProfileDropdownProps {
  user: User;
  profile: Resident;
  isAvailable: boolean;
  onStatusChange: (available: boolean) => void;
  onShowBeaconScore: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export function ProfileDropdown({
  user,
  profile,
  isAvailable,
  onStatusChange,
  onShowBeaconScore,
  onEditProfile,
  onLogout
}: ProfileDropdownProps) {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative w-16 h-16 rounded-full glassmorphism border-0 text-2xl"
          data-testid="profile-button"
        >
          👤
          <StatusIndicator
            isAvailable={isAvailable}
            size="sm"
            showGlow
          />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="glassmorphism border-0 w-64">
        <div className="p-4 border-b border-border">
          <p className="font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">Door: {profile.doorNumber}</p>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
          <p className="text-sm text-muted-foreground">{profile.address}</p>
        </div>
        
        <div className="p-2 space-y-1">
          <DropdownMenuItem onClick={onShowBeaconScore} data-testid="beacon-score-button">
            💰 {t('beacon-score')}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onEditProfile}>
            ✏️ {t('edit')} Profile
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={onLogout}
            className="text-destructive focus:text-destructive"
            data-testid="logout-button"
          >
            🚪 {t('logout')}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
