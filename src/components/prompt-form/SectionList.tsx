
import React from 'react';
import { usePromptStore } from '@/store/promptStore';
import PromptSection from '@/components/PromptSection';
import DraggableSection from './DraggableSection';

const SectionList: React.FC = () => {
  const { sections, activeSectionId, setActiveSection } = usePromptStore();

  // Group sections by parent-child relationships
  const topLevelSections = sections.filter(section => !section.parentId);
  const childSections = sections.filter(section => section.parentId);

  const getSectionChildren = (parentId: string) => {
    return childSections
      .filter(section => section.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  };

  const sortedTopLevelSections = topLevelSections.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedTopLevelSections.map((section, index) => (
        <div key={section.id}>
          <DraggableSection section={section} index={index}>
            <PromptSection
              key={section.id}
              id={section.id}
              name={section.name}
              content={section.content}
              isRequired={section.isRequired}
              level={section.level ?? 1}
              isArea={section.isArea ?? false}
              isActive={activeSectionId === section.id}
              onClick={() => setActiveSection(section.id)}
            />
          </DraggableSection>
          
          {/* Render child sections */}
          {section.isArea && (
            <div className="ml-6 mt-2 space-y-2">
              {getSectionChildren(section.id).map((childSection, childIndex) => (
                <DraggableSection 
                  key={childSection.id} 
                  section={childSection} 
                  index={childIndex}
                  parentId={section.id}
                >
                  <PromptSection
                    key={childSection.id}
                    id={childSection.id}
                    name={childSection.name}
                    content={childSection.content}
                    isRequired={childSection.isRequired}
                    level={childSection.level ?? 2}
                    isArea={childSection.isArea ?? false}
                    isActive={activeSectionId === childSection.id}
                    onClick={() => setActiveSection(childSection.id)}
                  />
                </DraggableSection>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionList;
