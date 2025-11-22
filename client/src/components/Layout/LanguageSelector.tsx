import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import type { Language } from "@/types";

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta' as Language, name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'or' as Language, name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-40 glassmorphism border-0 text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="glassmorphism border-0">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="text-foreground">
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
