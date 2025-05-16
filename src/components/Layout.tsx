
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutTemplate, 
  FileText, 
  Settings, 
  PenTool, 
  Moon, 
  Sun
} from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = React.useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const navigation = [
    { name: 'Builder', href: '/', icon: PenTool },
    { name: 'Templates', href: '/templates', icon: LayoutTemplate },
    { name: 'Preview', href: '/preview', icon: FileText },
  ];
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-16 bg-card border-r flex flex-col items-center py-4">
        <div className="flex-1 flex flex-col items-center space-y-4 mt-6">
          {navigation.map((item) => {
            const isActive = 
              (item.href === '/' && location.pathname === '/') || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
              
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-10 w-10",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="sr-only">{item.name}</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle theme</TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <main>
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Layout;
