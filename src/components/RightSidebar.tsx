
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import Ideas from '@/components/Ideas';

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onToggle }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 top-4 z-50 shadow-lg"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh]">
          <div className="p-4 overflow-y-auto">
            <Ideas />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="fixed right-4 top-4 z-50 shadow-lg"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>

      {/* Right Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Ideas & Todo-Listen</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-73px)]">
          <Ideas />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default RightSidebar;
