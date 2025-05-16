
import React from 'react';
import { usePromptStore } from '@/store/promptStore';
import PromptForm from '@/components/PromptForm';
import PromptPreview from '@/components/PromptPreview';

const BuilderPage: React.FC = () => {
  const { isPreviewMode } = usePromptStore();
  
  return (
    <div className="container py-8">
      {isPreviewMode ? <PromptPreview /> : <PromptForm />}
    </div>
  );
};

export default BuilderPage;
