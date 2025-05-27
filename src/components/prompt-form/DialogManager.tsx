
import React from 'react';
import { PromptSection } from '@/types/prompt';
import NewSectionDialog from './NewSectionDialog';
import SaveTemplateFormDialog from './SaveTemplateFormDialog';
import UploadPromptDialog from './upload-dialog/UploadPromptDialog';
import PromptTemplateDialog from './PromptTemplateDialog';
import { usePromptStore } from '@/store/promptStore';

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
  const { sections: allSections } = usePromptStore();
  
  // Get existing section IDs
  const existingSections = allSections.map(section => section.id);
  
  // Get areas for the NewSectionDialog
  const areas = allSections.filter(section => section.isArea);

  return (
    <>
      <NewSectionDialog 
        open={newSectionDialogOpen}
        onOpenChange={onNewSectionDialogChange}
        onAddCustomSection={onAddCustomSection}
        onAddExistingSection={onAddExistingSection}
        existingSections={existingSections}
        areas={areas}
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
