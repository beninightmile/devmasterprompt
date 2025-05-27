
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface AutoSaveSettingsProps {
  enabled: boolean;
  interval: number;
  lastSaveTime: Date | null;
  onToggle: (enabled: boolean) => void;
  onIntervalChange: (minutes: number) => void;
}

const AutoSaveSettings: React.FC<AutoSaveSettingsProps> = ({
  enabled,
  interval,
  lastSaveTime,
  onToggle,
  onIntervalChange,
}) => {
  const [open, setOpen] = useState(false);
  const [tempInterval, setTempInterval] = useState(interval);
  
  const handleIntervalChange = (value: number[]): void => {
    if (value.length > 0 && typeof value[0] === 'number') {
      setTempInterval(value[0]);
    }
  };
  
  const handleManualIntervalChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setTempInterval(Math.max(1, Math.min(60, val)));
    }
  };
  
  const handleSave = (): void => {
    onIntervalChange(tempInterval);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Clock size={16} />
          <span>Auto-save {enabled ? 'On' : 'Off'}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Auto-save Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save-enabled" className="text-base">Enable auto-save</Label>
            <Switch 
              id="auto-save-enabled" 
              checked={enabled} 
              onCheckedChange={onToggle} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save-interval" className="text-base">Save interval (minutes)</Label>
              <Input 
                id="auto-save-interval-input"
                type="number"
                value={tempInterval.toString()}
                onChange={handleManualIntervalChange}
                min={1}
                max={60}
                className="w-16"
              />
            </div>
            <Slider
              id="auto-save-interval"
              value={[tempInterval]}
              onValueChange={handleIntervalChange}
              min={1}
              max={60}
              step={1}
              disabled={!enabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoSaveSettings;
