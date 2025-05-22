
import React from 'react';
import NewSectionDialog from './NewSectionDialog';
import SaveTemplateFormDialog from './SaveTemplateFormDialog';
import UploadContentDialog from './upload-dialog/UploadContentDialog';
import SoftwareTemplateDialog from './SoftwareTemplateDialog';
import { PromptSection } from '@/types/prompt';

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
  onAddCustomSection: (sectionName: string, areaId?: string) => void;
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
  // Filter out areas
  const areas = sections.filter(section => section.isArea);
  
  return (
    <>
      <NewSectionDialog 
        open={newSectionDialogOpen}
        onOpenChange={onNewSectionDialogChange}
        onAddCustomSection={onAddCustomSection}
        onAddExistingSection={onAddExistingSection}
        existingSections={sections.map(section => section.id)}
        areas={areas}
      />

      <SaveTemplateFormDialog 
        open={saveTemplateDialogOpen}
        onOpenChange={onSaveTemplateDialogChange}
        initialName={templateName}
      />
      
      <UploadContentDialog
        open={uploadDialogOpen}
        onOpenChange={onUploadDialogChange}
        onImportSections={onImportSections}
      />

      <SoftwareTemplateDialog
        open={softwareTemplateDialogOpen}
        onOpenChange={onSoftwareTemplateDialogChange}
        onSelectTemplate={onApplySoftwareTemplate}
      />
    </>
  );
};

export default DialogManager;
