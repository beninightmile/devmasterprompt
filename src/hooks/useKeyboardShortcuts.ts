
import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onToggleRightSidebar?: () => void;
}

export const useKeyboardShortcuts = ({ onToggleRightSidebar }: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + I to toggle right sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
        event.preventDefault();
        onToggleRightSidebar?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleRightSidebar]);
};
