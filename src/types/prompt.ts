
export interface PromptSection {
  id: string;
  name: string;
  content: string;
  order: number;
  isRequired: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  sections: PromptSection[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  totalTokens?: number;
}

export interface InspirationItem {
  id: string;
  sectionId: string;
  type: 'link' | 'image' | 'text';
  content: string;
  title?: string;
}
