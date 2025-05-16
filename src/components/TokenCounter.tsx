
import React from 'react';
import { estimatePromptTokens } from '@/services/prompt-service';

interface TokenCounterProps {
  text: string;
  className?: string;
}

const TokenCounter: React.FC<TokenCounterProps> = ({ text, className = '' }) => {
  const tokenCount = estimatePromptTokens(text || '');
  
  return (
    <span className={`text-xs text-muted-foreground ${className}`}>
      {tokenCount} tokens
    </span>
  );
};

export default TokenCounter;
