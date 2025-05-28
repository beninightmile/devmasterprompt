
import React from 'react';
import { usePromptStore } from '@/store/promptStore';
import TokenCounter from './TokenCounter';
import { generatePromptText } from '@/services/prompt-service';

const RightSidebar: React.FC = () => {
  const { sections } = usePromptStore();
  const promptText = generatePromptText(sections);

  return (
    <div className="w-80 border-l bg-background p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Prompt Statistics</h3>
          <TokenCounter text={promptText} />
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Sections</h4>
          <p className="text-sm text-muted-foreground">
            {sections.length} sections created
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
