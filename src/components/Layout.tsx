
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Save, Eye } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    {
      href: '/',
      label: 'Prompt Builder',
      icon: FileText,
      active: location.pathname === '/'
    },
    {
      href: '/saved-prompts',
      label: 'Gespeicherte Prompts',
      icon: Save,
      active: location.pathname === '/saved-prompts'
    },
    {
      href: '/preview',
      label: 'Vorschau',
      icon: Eye,
      active: location.pathname === '/preview'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="font-bold text-xl">Prompt Builder</span>
          </Link>
          
          <nav className="flex items-center space-x-1 ml-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "flex items-center gap-2",
                    item.active && "bg-primary text-primary-foreground"
                  )}
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
