
import { PromptSection } from '@/types/prompt';
import { SoftwareTemplate } from './types';

export const createStandardSections = (): PromptSection[] => {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Projektname',
      content: '',
      order: 1,
      isRequired: false,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Beschreibung',
      content: '',
      order: 2,
      isRequired: false,
      level: 1
    }
  ];
};

export const createZeroShotTemplate = (): SoftwareTemplate => {
  const sections: PromptSection[] = [
    {
      id: crypto.randomUUID(),
      name: 'Role',
      content: 'You are an expert AI assistant.',
      order: 1,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Task',
      content: 'Complete the following task with precision and clarity.',
      order: 2,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Context',
      content: 'Use the provided context to inform your response.',
      order: 3,
      isRequired: false,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Output Format',
      content: 'Provide your response in the specified format.',
      order: 4,
      isRequired: true,
      level: 1
    }
  ];

  return {
    id: 'zero_shot_template',
    name: 'Zero-Shot Prompt Template',
    description: 'A basic template for creating effective zero-shot prompts with clear role, task, and output specifications.',
    complexity: 'low',
    estimatedTime: '15-30 minutes',
    type: 'zero_shot_template',
    category: 'prompt_engineering',
    sections: sections.map(s => ({ ...s, level: s.level ?? 1 })),
    areaCount: 0,
    sectionCount: sections.length,
    tags: ['Zero-Shot', 'Basic', 'Prompt Engineering']
  };
};

export const createROSESTemplate = (): SoftwareTemplate => {
  const sections: PromptSection[] = [
    {
      id: crypto.randomUUID(),
      name: 'Role',
      content: 'Define the AI\'s role and expertise area.',
      order: 1,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Objective',
      content: 'Clearly state what you want to achieve.',
      order: 2,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Scenario',
      content: 'Provide relevant context and background information.',
      order: 3,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Expected Response',
      content: 'Specify the desired format and style of the output.',
      order: 4,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Shortened',
      content: 'Condense the prompt for clarity and efficiency.',
      order: 5,
      isRequired: false,
      level: 1
    }
  ];

  return {
    id: 'roses_framework',
    name: 'ROSES Framework Template',
    description: 'A structured approach using Role, Objective, Scenario, Expected Response, and Shortened format for comprehensive prompt engineering.',
    complexity: 'medium',
    estimatedTime: '30-45 minutes',
    type: 'roses_framework',
    category: 'prompt_engineering',
    sections: sections.map(s => ({ ...s, level: s.level ?? 1 })),
    areaCount: 0,
    sectionCount: sections.length,
    tags: ['ROSES', 'Framework', 'Structured']
  };
};

export const createChainOfThoughtTemplate = (): SoftwareTemplate => {
  const sections: PromptSection[] = [
    {
      id: crypto.randomUUID(),
      name: 'Problem Statement',
      content: 'Clearly define the problem to be solved.',
      order: 1,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Step-by-Step Instructions',
      content: 'Break down the solution process into clear steps.',
      order: 2,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Examples',
      content: 'Provide examples of the reasoning process.',
      order: 3,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Output Format',
      content: 'Specify how the final answer should be presented.',
      order: 4,
      isRequired: true,
      level: 1
    }
  ];

  return {
    id: 'chain_of_thought',
    name: 'Chain of Thought Template',
    description: 'Template for creating prompts that encourage step-by-step reasoning and problem-solving.',
    complexity: 'medium',
    estimatedTime: '20-40 minutes',
    type: 'chain_of_thought',
    category: 'prompt_engineering',
    sections: sections.map(s => ({ ...s, level: s.level ?? 1 })),
    areaCount: 0,
    sectionCount: sections.length,
    tags: ['Chain of Thought', 'Reasoning', 'Problem Solving']
  };
};

export const createPromptFrameworkTemplate = (): SoftwareTemplate => {
  const sections: PromptSection[] = [
    {
      id: crypto.randomUUID(),
      name: 'Context',
      content: 'Provide background information and setting.',
      order: 1,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Instruction',
      content: 'Give clear, specific instructions.',
      order: 2,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Input Data',
      content: 'Specify the input or data to work with.',
      order: 3,
      isRequired: false,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Output Requirements',
      content: 'Define the expected output format and requirements.',
      order: 4,
      isRequired: true,
      level: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Constraints',
      content: 'List any limitations or constraints to consider.',
      order: 5,
      isRequired: false,
      level: 1
    }
  ];

  return {
    id: 'prompt_framework',
    name: 'General Prompt Framework',
    description: 'A comprehensive framework for building effective prompts with context, instructions, and clear output requirements.',
    complexity: 'medium',
    estimatedTime: '25-35 minutes',
    type: 'prompt_framework',
    category: 'prompt_engineering',
    sections: sections.map(s => ({ ...s, level: s.level ?? 1 })),
    areaCount: 0,
    sectionCount: sections.length,
    tags: ['Framework', 'General Purpose', 'Structured']
  };
};
