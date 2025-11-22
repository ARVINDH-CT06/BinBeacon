// client/src/hooks/use-voice.tsx
import { useCallback, useEffect, useRef } from "react";
import { useLanguage } from "./use-language";

export function useVoice() {
  const { language, t } = useLanguage();
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const pickVoice = useCallback((langCode: string) => {
    const voices = window.speechSynthesis.getVoices() || [];
    // exact match or startsWith fallback
    let v = voices.find((v) => v.lang && v.lang.toLowerCase() === langCode.toLowerCase());
    if (!v) v = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(langCode.split("-")[0]));
    if (!v) v = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
    return v || null;
  }, []);

  useEffect(() => {
    const setVoices = () => {
      const langMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", ta: "ta-IN" };
      const preferred = langMap[language] || "en-IN";
      voiceRef.current = pickVoice(preferred);
    };
    setVoices();
    window.speechSynthesis.onvoiceschanged = setVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language, pickVoice]);

  const speak = useCallback(
    (messageKey: string, customText?: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const text = customText || t(messageKey);
      const utter = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", ta: "ta-IN" };
      utter.lang = langMap[language] || "en-IN";
      if (voiceRef.current) utter.voice = voiceRef.current;
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.volume = 0.9;
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn("TTS failed", e);
      }
    },
    [language, t]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stopSpeaking };
}
