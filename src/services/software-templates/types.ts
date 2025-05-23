
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
  | 'microservice_architecture';

// Interface for the software template metadata
export interface SoftwareTemplate {
  id: string;
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high' | 'enterprise';
  estimatedTime: string;  // "3-5 days", "2-4 weeks", etc.
  type: SoftwareTemplateType;
  sections: PromptSection[];
  areaCount: number; // Number of areas in the template
  sectionCount: number; // Number of non-area sections in the template
}
