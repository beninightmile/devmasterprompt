
import { SoftwareTemplate } from './types';
import { createTemplateArea, createStandardSections } from './template-factory';

// Prompt Engineering Framework Templates
export const promptEngineeringTemplates: SoftwareTemplate[] = [
  {
    id: 'zero_shot_framework',
    name: 'Zero-Shot Formula Framework',
    description: 'Foundation framework for single-shot prompting with role, context, task, format, and parameters.',
    complexity: 'low',
    estimatedTime: '15-30 minutes',
    type: 'zero_shot_template',
    category: 'prompt_engineering',
    sections: [
      // Standard sections for prompt engineering
      ...createStandardSections().map(section => ({
        ...section,
        name: section.name === 'Rolle' ? 'Prompt Purpose' : 
              section.name === 'Kontext' ? 'Use Case Context' :
              section.name === 'Ziel' ? 'Expected Outcome' :
              section.name,
        content: section.name === 'Rolle' ? 'Define what this prompt is designed to accomplish' :
                section.name === 'Kontext' ? 'Describe when and how this prompt should be used' :
                section.name === 'Ziel' ? 'Specify what success looks like for this prompt' :
                section.content
      })),
      
      // Zero-Shot Framework Areas
      ...createTemplateArea({
        id: 'zero_shot_role',
        name: 'Role Definition',
        order: 10,
        children: [
          {
            name: 'AI Role Assignment',
            content: 'You are a [specific professional] with [X years] of experience in [industry/field] and expertise in [specific domain].',
            isRequired: true
          },
          {
            name: 'Expertise Specification',
            content: 'Your background includes [relevant experience] and you approach problems from a [perspective] viewpoint.',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'zero_shot_context',
        name: 'Context Setting',
        order: 20,
        children: [
          {
            name: 'Situation Description',
            content: 'The current situation is [describe scenario]. Key constraints include [limitations]. Available resources are [tools/data/budget].',
            isRequired: true
          },
          {
            name: 'Background Information',
            content: 'Relevant background: [context details]. Important factors to consider: [key variables].',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'zero_shot_task',
        name: 'Task Definition',
        order: 30,
        children: [
          {
            name: 'Primary Task',
            content: 'Create/Analyze/Develop [specific deliverable] that will [measurable outcome] for [target audience].',
            isRequired: true
          },
          {
            name: 'Success Criteria',
            content: 'The output should achieve [specific goals] and include [required elements].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'zero_shot_format',
        name: 'Format Specification',
        order: 40,
        children: [
          {
            name: 'Output Structure',
            content: 'Format the response as [structure type] with [specific sections]. Include [required elements] and maintain [style preferences].',
            isRequired: true
          },
          {
            name: 'Style Guidelines',
            content: 'Use a [tone] tone, write at [complexity level], and structure content with [formatting preferences].',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'zero_shot_parameters',
        name: 'Parameters & Constraints',
        order: 50,
        children: [
          {
            name: 'Constraints',
            content: 'Limitations: [length limits], [topic boundaries], [style restrictions]. Must avoid: [exclusions].',
            isRequired: false
          },
          {
            name: 'Quality Controls',
            content: 'Ensure [quality standards]. Double-check for [specific requirements]. If uncertain about [conditions], [fallback behavior].',
            isRequired: false
          }
        ]
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  },
  
  {
    id: 'roses_framework',
    name: 'ROSES Framework',
    description: 'Comprehensive framework for complex analytical tasks with Role, Objective, Scenario, Expected Solution, and Steps.',
    complexity: 'medium',
    estimatedTime: '30-45 minutes',
    type: 'prompt_framework',
    category: 'prompt_engineering',
    sections: [
      ...createStandardSections().map(section => ({
        ...section,
        name: section.name === 'Rolle' ? 'Framework Purpose' : 
              section.name === 'Kontext' ? 'Application Context' :
              section.name === 'Ziel' ? 'Framework Goals' :
              section.name,
        content: section.name === 'Rolle' ? 'ROSES framework for structured analytical prompting' :
                section.name === 'Kontext' ? 'Best for complex business analysis, strategic planning, and problem-solving tasks' :
                section.name === 'Ziel' ? 'Produce comprehensive, well-reasoned analysis with clear action steps' :
                section.content
      })),
      
      ...createTemplateArea({
        id: 'roses_role',
        name: 'R - Role Definition',
        order: 10,
        children: [
          {
            name: 'Professional Identity',
            content: 'You are a [specific professional title] with [X years] of experience in [industry/domain].',
            isRequired: true
          },
          {
            name: 'Expertise & Perspective',
            content: 'Your expertise includes [specific skills] and you approach problems from a [methodology] perspective with emphasis on [key values].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_objective',
        name: 'O - Objective Clarification',
        order: 20,
        children: [
          {
            name: 'Primary Goal',
            content: 'Your objective is to [action verb] [specific deliverable] that will [measurable outcome] for [stakeholder/organization].',
            isRequired: true
          },
          {
            name: 'Success Metrics',
            content: 'Success will be measured by [specific criteria]. The outcome should achieve [quantifiable targets].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_scenario',
        name: 'S - Scenario Description',
        order: 30,
        children: [
          {
            name: 'Current Situation',
            content: '[Organization/team] is facing [current challenge/opportunity]. The context includes [relevant background].',
            isRequired: true
          },
          {
            name: 'Constraints & Resources',
            content: 'Key constraints: [limitations]. Available resources: [tools/budget/team/data]. Important stakeholders: [who is involved].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_expected',
        name: 'E - Expected Solution',
        order: 40,
        children: [
          {
            name: 'Deliverable Format',
            content: 'Deliver a [format type] that includes: 1) [element 1], 2) [element 2], 3) [element 3]. The solution should be [detail level] and focus on [priorities].',
            isRequired: true
          },
          {
            name: 'Quality Standards',
            content: 'The output must meet [quality criteria] and should be actionable for [target audience]. Include [specific requirements].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_steps',
        name: 'S - Steps & Process',
        order: 50,
        children: [
          {
            name: 'Analysis Process',
            content: '1. Begin by [first step] considering [factors]\n2. Then [second step] with emphasis on [aspect]\n3. Next, [third step] using [methodology]\n4. Finally, [final step] to ensure [quality check]',
            isRequired: true
          },
          {
            name: 'Validation Methods',
            content: 'Validate your analysis by [verification method]. Check for [potential issues]. If assumptions are needed, [how to handle uncertainty].',
            isRequired: false
          }
        ]
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  },
  
  {
    id: 'chain_of_thought_framework',
    name: 'Chain-of-Thought (CoT) Framework',
    description: 'Structured reasoning framework that guides AI through explicit step-by-step thinking for complex problems.',
    complexity: 'medium',
    estimatedTime: '20-40 minutes',
    type: 'chain_of_thought_template',
    category: 'prompt_engineering',
    sections: [
      ...createStandardSections().map(section => ({
        ...section,
        name: section.name === 'Rolle' ? 'Reasoning Purpose' : 
              section.name === 'Kontext' ? 'Problem Context' :
              section.name === 'Ziel' ? 'Reasoning Goals' :
              section.name,
        content: section.name === 'Rolle' ? 'Chain-of-Thought framework for step-by-step analytical reasoning' :
                section.name === 'Kontext' ? 'Best for complex calculations, logical problems, and multi-step analysis' :
                section.name === 'Ziel' ? 'Produce transparent, verifiable reasoning with clear logical progression' :
                section.content
      })),
      
      ...createTemplateArea({
        id: 'cot_problem_setup',
        name: 'Problem Setup & Context',
        order: 10,
        children: [
          {
            name: 'Problem Statement',
            content: '[Clear problem description]. To solve this, I need to consider [key variables] and work through [type of analysis] step-by-step.',
            isRequired: true
          },
          {
            name: 'Given Information',
            content: 'Given: [list all provided information]. Assumptions: [any necessary assumptions]. Goal: [what needs to be determined].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'cot_reasoning_steps',
        name: 'Step-by-Step Reasoning',
        order: 20,
        children: [
          {
            name: 'Reasoning Process',
            content: 'To solve this problem, I\'ll think through it step-by-step:\n\nStep 1: [First reasoning step with explanation]\nStep 2: [Second reasoning step with explanation]\nStep 3: [Third reasoning step with explanation]\n[Continue as needed]',
            isRequired: true
          },
          {
            name: 'Calculation Details',
            content: 'Mathematical work:\n- [Show calculations]\n- [Explain formulas used]\n- [Verify intermediate results]',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'cot_verification',
        name: 'Verification & Validation',
        order: 30,
        children: [
          {
            name: 'Answer Verification',
            content: 'Let me verify this answer: [verification method]. Cross-check: [alternative approach]. The result makes sense because [logical validation].',
            isRequired: true
          },
          {
            name: 'Final Answer',
            content: 'Therefore, the answer is [conclusion]. This solution accounts for [key factors] and follows [reasoning methodology].',
            isRequired: true
          }
        ]
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  },
  
  {
    id: 'marketing_prompt_template',
    name: 'Marketing Campaign Framework',
    description: 'Specialized template for marketing content creation, campaign planning, and audience targeting.',
    complexity: 'low',
    estimatedTime: '15-25 minutes',
    type: 'marketing_template',
    category: 'prompt_engineering',
    sections: [
      ...createStandardSections().map(section => ({
        ...section,
        name: section.name === 'Rolle' ? 'Campaign Purpose' : 
              section.name === 'Kontext' ? 'Market Context' :
              section.name === 'Ziel' ? 'Marketing Goals' :
              section.name,
        content: section.name === 'Rolle' ? 'Define the marketing campaign objective and target outcome' :
                section.name === 'Kontext' ? 'Describe market conditions, competitive landscape, and business context' :
                section.name === 'Ziel' ? 'Specify measurable marketing goals and success criteria' :
                section.content
      })),
      
      ...createTemplateArea({
        id: 'marketing_role',
        name: 'Marketing Expert Role',
        order: 10,
        children: [
          {
            name: 'Specialist Definition',
            content: 'You are a [marketing specialization] with expertise in [channel/industry] and [X years] of experience in [specific domain].',
            isRequired: true
          },
          {
            name: 'Approach & Philosophy',
            content: 'You take a [methodology] approach, focusing on [key principles] and prioritizing [primary metrics].',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'marketing_audience',
        name: 'Audience & Targeting',
        order: 20,
        children: [
          {
            name: 'Target Audience',
            content: 'Primary audience: [demographic description]. Psychographics: [interests/values]. Pain points: [key challenges]. Goals: [what they want to achieve].',
            isRequired: true
          },
          {
            name: 'Customer Journey Stage',
            content: 'This campaign targets customers at the [awareness/consideration/decision] stage. Current relationship with brand: [existing perception].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'marketing_message',
        name: 'Message & Positioning',
        order: 30,
        children: [
          {
            name: 'Key Value Proposition',
            content: 'Primary message: [core value proposition]. Key benefits: [benefit 1], [benefit 2], [benefit 3]. Differentiation: [competitive advantage].',
            isRequired: true
          },
          {
            name: 'Tone & Voice',
            content: 'Brand voice: [tone description]. Communication style: [formal/casual/technical]. Emotional tone: [aspirational/urgent/reassuring].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'marketing_content',
        name: 'Content Requirements',
        order: 40,
        children: [
          {
            name: 'Content Specifications',
            content: 'Create [content type] for [platform/channel]. Length: [word count/character limit]. Include: [required elements]. Call-to-action: [specific CTA].',
            isRequired: true
          },
          {
            name: 'Platform Optimization',
            content: 'Optimize for [platform] with [specific requirements]. Visual elements: [description]. Technical specs: [format/dimensions].',
            isRequired: false
          }
        ]
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  },
  
  {
    id: 'business_analysis_framework',
    name: 'Business Analysis Framework',
    description: 'Comprehensive framework for business analysis, strategic planning, and decision-making processes.',
    complexity: 'high',
    estimatedTime: '45-60 minutes',
    type: 'business_analysis_template',
    category: 'prompt_engineering',
    sections: [
      ...createStandardSections().map(section => ({
        ...section,
        name: section.name === 'Rolle' ? 'Analysis Purpose' : 
              section.name === 'Kontext' ? 'Business Context' :
              section.name === 'Ziel' ? 'Analysis Goals' :
              section.name,
        content: section.name === 'Rolle' ? 'Define the business analysis objective and strategic importance' :
                section.name === 'Kontext' ? 'Describe business environment, stakeholders, and organizational context' :
                section.name === 'Ziel' ? 'Specify analysis outcomes and decision-making objectives' :
                section.content
      })),
      
      ...createTemplateArea({
        id: 'analyst_role',
        name: 'Business Analyst Role',
        order: 10,
        children: [
          {
            name: 'Analyst Expertise',
            content: 'You are a [type of analyst] with [X years] experience in [industry/domain] and expertise in [analytical methods].',
            isRequired: true
          },
          {
            name: 'Analytical Approach',
            content: 'Your approach emphasizes [methodology] using [frameworks/tools]. You prioritize [key principles] in your analysis.',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'business_situation',
        name: 'Business Situation Analysis',
        order: 20,
        children: [
          {
            name: 'Current State',
            content: 'Current business situation: [description]. Key metrics: [current performance]. Market position: [competitive standing].',
            isRequired: true
          },
          {
            name: 'Stakeholders & Constraints',
            content: 'Key stakeholders: [who is involved]. Constraints: [budget/time/resources]. Success criteria: [how success is measured].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'analysis_framework',
        name: 'Analysis Framework & Methodology',
        order: 30,
        children: [
          {
            name: 'Analytical Methods',
            content: 'Apply [specific framework] to analyze [business aspect]. Consider [internal factors] and [external factors]. Use [data sources].',
            isRequired: true
          },
          {
            name: 'Evaluation Criteria',
            content: 'Evaluate options based on: [criterion 1], [criterion 2], [criterion 3]. Weight factors: [importance rankings].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'recommendations',
        name: 'Recommendations & Implementation',
        order: 40,
        children: [
          {
            name: 'Strategic Recommendations',
            content: 'Provide prioritized recommendations with: 1) [recommendation 1 with rationale], 2) [recommendation 2 with rationale], 3) [recommendation 3 with rationale].',
            isRequired: true
          },
          {
            name: 'Implementation Plan',
            content: 'Implementation timeline: [phases]. Resource requirements: [needs]. Risk mitigation: [key risks and solutions].',
            isRequired: true
          }
        ]
      })
    ],
    get areaCount() { 
      return this.sections.filter(s => s.isArea).length;
    },
    get sectionCount() {
      return this.sections.filter(s => !s.isArea && s.level > 1).length;
    }
  }
];
