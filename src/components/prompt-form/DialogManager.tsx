
import React from 'react';
import NewSectionDialog from './NewSectionDialog';
import SaveTemplateFormDialog from './SaveTemplateFormDialog';
import UploadPromptDialog from './upload-dialog/UploadPromptDialog';
import { PromptSection } from '@/types/prompt';

interface DialogManagerProps {
  newSectionDialogOpen: boolean;
  saveTemplateDialogOpen: boolean;
  uploadDialogOpen: boolean;
  sections: PromptSection[];
  templateName: string;
  onNewSectionDialogChange: (open: boolean) => void;
  onSaveTemplateDialogChange: (open: boolean) => void;
  onUploadDialogChange: (open: boolean) => void;
  onAddCustomSection: (sectionName: string) => void;
  onAddExistingSection: (template: any) => void;
  onImportSections: (sections: PromptSection[]) => void;
}

const DialogManager: React.FC<DialogManagerProps> = ({
  newSectionDialogOpen,
  saveTemplateDialogOpen,
  uploadDialogOpen,
  sections,
  templateName,
  onNewSectionDialogChange,
  onSaveTemplateDialogChange,
  onUploadDialogChange,
  onAddCustomSection,
  onAddExistingSection,
  onImportSections,
}) => {
  return (
    <>
      <NewSectionDialog 
        open={newSectionDialogOpen}
        onOpenChange={onNewSectionDialogChange}
        onAddCustomSection={onAddCustomSection}
        onAddExistingSection={onAddExistingSection}
        existingSections={sections.map(section => section.id)}
      />

      <SaveTemplateFormDialog 
        open={saveTemplateDialogOpen}
        onOpenChange={onSaveTemplateDialogChange}
        initialName={templateName}
      />
      
      <UploadPromptDialog
        open={uploadDialogOpen}
        onOpenChange={onUploadDialogChange}
        onImportSections={onImportSections}
      />
    </>
  );
};

export default DialogManager;
