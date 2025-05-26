
import React from 'react';
import { PromptSection } from '@/types/prompt';
import NewSectionDialog from './NewSectionDialog';
import SaveTemplateFormDialog from './SaveTemplateFormDialog';
import UploadPromptDialog from './upload-dialog/UploadPromptDialog';
import PromptTemplateDialog from './PromptTemplateDialog';

interface DialogManagerProps {
  newSectionDialogOpen: boolean;
  saveTemplateDialogOpen: boolean;
  uploadDialogOpen: boolean;
  softwareTemplateDialogOpen: boolean;
  sections: PromptSection[];
  templateName: string;
  onNewSectionDialogChange: (open: boolean) => void;
  onSaveTemplateDialogChange: (open: boolean) => void;
  onUploadDialogChange: (open: boolean) => void;
  onSoftwareTemplateDialogChange: (open: boolean) => void;
  onAddCustomSection: (name: string, areaId?: string) => void;
  onAddExistingSection: (template: any) => void;
  onImportSections: (sections: PromptSection[]) => void;
  onApplySoftwareTemplate: (sections: PromptSection[]) => void;
}

const DialogManager: React.FC<DialogManagerProps> = ({
  newSectionDialogOpen,
  saveTemplateDialogOpen,
  uploadDialogOpen,
  softwareTemplateDialogOpen,
  sections,
  templateName,
  onNewSectionDialogChange,
  onSaveTemplateDialogChange,
  onUploadDialogChange,
  onSoftwareTemplateDialogChange,
  onAddCustomSection,
  onAddExistingSection,
  onImportSections,
  onApplySoftwareTemplate,
}) => {
  return (
    <>
      <NewSectionDialog 
        open={newSectionDialogOpen}
        onOpenChange={onNewSectionDialogChange}
        onAddCustomSection={onAddCustomSection}
        onAddExistingSection={onAddExistingSection}
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
      
      <PromptTemplateDialog
        open={softwareTemplateDialogOpen}
        onOpenChange={onSoftwareTemplateDialogChange}
        onSelectTemplate={onApplySoftwareTemplate}
      />
    </>
  );
};

export default DialogManager;
