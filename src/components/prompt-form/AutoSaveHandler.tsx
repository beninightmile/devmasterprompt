
import { useEffect, useRef } from 'react';
import { usePromptStore } from '@/store/promptStore';

interface AutoSaveHandlerProps {
  onAutoSave: () => void;
}

const AutoSaveHandler: React.FC<AutoSaveHandlerProps> = ({ onAutoSave }) => {
  const {
    templateName,
    autoSaveEnabled,
    autoSaveInterval,
  } = usePromptStore();
  
  const autoSaveTimerRef = useRef<number | null>(null);
  
  // Setup auto-save
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      window.clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    
    // Set up new timer if auto-save is enabled
    if (autoSaveEnabled && templateName.trim()) {
      const intervalMs = autoSaveInterval * 60 * 1000; // Convert minutes to milliseconds
      autoSaveTimerRef.current = window.setInterval(() => {
        onAutoSave();
      }, intervalMs);
    }
    
    // Clean up on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveEnabled, autoSaveInterval, templateName, onAutoSave]);
  
  return null; // This is a "headless" component with no UI
};

export default AutoSaveHandler;
