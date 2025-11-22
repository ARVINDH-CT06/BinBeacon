import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface BeaconScoreProps {
  score: number;
  name: string;
  doorNumber?: string;
  address?: string;
  onClose?: () => void;
}

export function BeaconScore({ score, name, doorNumber, address, onClose }: BeaconScoreProps) {
  const { t } = useLanguage();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <GlassCard className="max-w-md w-full text-center">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            data-testid="close-beacon-score"
          >
            ✕
          </button>
        )}
        
        <div className="text-6xl mb-4">💰</div>
        
        <h3 className="text-2xl font-bold mb-4">{t('beacon-score')}</h3>
        
        <div className={cn("text-6xl font-bold mb-4", getScoreColor(score))}>
          {score}/100
        </div>
        
        <div className="w-full bg-muted rounded-full h-4 mb-4">
          <div 
            className="bg-primary h-4 rounded-full transition-all duration-500" 
            style={{ width: `${score}%` }}
          />
        </div>
        
        <p className="text-lg font-semibold mb-4 text-foreground">
          {getScoreStatus(score)}
        </p>
        
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-foreground">{t('name')}:</span>
            <span className="text-muted-foreground">{name}</span>
          </div>
          {doorNumber && (
            <div className="flex justify-between">
              <span className="text-foreground">{t('door-number')}:</span>
              <span className="text-muted-foreground">{doorNumber}</span>
            </div>
          )}
          {address && (
            <div className="flex justify-between">
              <span className="text-foreground">{t('address')}:</span>
              <span className="text-muted-foreground">{address}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground">Score:</span>
            <span className={cn("font-semibold", getScoreColor(score))}>{score}/100</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
