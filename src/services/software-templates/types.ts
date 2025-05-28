
import { PromptSection } from '@/types/prompt';

// Define the types of software templates available
export type SoftwareTemplateType = 
  | 'web_app_simple' 
  | 'web_app_complex'
  | 'mobile_app' 
  | 'desktop_app'
  | 'api_service'
  | 'fullstack_application'
  | 'enterprise_system'
  | 'microservice_architecture'
  | 'zero_shot_template'
  | 'roses_framework'
  | 'chain_of_thought'
  | 'prompt_framework';

// Interface for the software template metadata
export interface SoftwareTemplate {
  id: string;
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high' | 'enterprise';
  estimatedTime: string;  // "3-5 days", "2-4 weeks", etc.
  type: SoftwareTemplateType;
  category: 'software' | 'prompt_engineering';
  sections: PromptSection[];
  areaCount: number; // Number of areas in the template
  sectionCount: number; // Number of non-area sections in the template
  tags?: string[]; // Tags for categorization and filtering
}
