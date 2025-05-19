
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptStore } from '@/store/promptStore';
import PromptForm from '@/components/prompt-form/PromptForm';
import PromptPreview from '@/components/PromptPreview';

const BuilderPage: React.FC = () => {
  const { isPreviewMode, setPreviewMode } = usePromptStore();
  const navigate = useNavigate();
  
  // Handle preview mode changes
  const handlePreviewToggle = (value: boolean) => {
    setPreviewMode(value);
    // If we're switching to preview mode from another page, navigate to builder
    if (value && window.location.pathname !== '/') {
      navigate('/');
    }
  };
  
  return (
    <div className="container py-8">
      {isPreviewMode ? <PromptPreview /> : <PromptForm onPreviewToggle={handlePreviewToggle} />}
    </div>
  );
};

export default BuilderPage;
