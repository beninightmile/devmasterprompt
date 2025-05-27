
export interface PromptSection {
  id: string;
  name: string;
  content: string;
  order: number;
  isRequired: boolean;
  level?: number;     // Hierarchical level for nested display
  parentId?: string | undefined;  // Reference to parent section for hierarchy - explicit undefined
  isArea?: boolean;   // Indicates if this section is an area
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface IdeaNote {
  id: string;
  content: string;
  todos: TodoItem[];
  createdAt: Date;
  updatedAt: Date;
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
