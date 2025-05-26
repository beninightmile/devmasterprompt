
import { SoftwareTemplate } from './types';
import { createTemplateArea, createStandardSections } from './template-factory';

export const promptEngineeringTemplates: SoftwareTemplate[] = [
  {
    id: 'zero_shot_framework',
    name: 'Zero-Shot Prompt Framework',
    description: 'Strukturiertes Framework für Zero-Shot Prompting mit Role, Context, Task, Format und Parameters.',
    complexity: 'low',
    estimatedTime: '15-30 Minuten',
    type: 'zero_shot_template',
    category: 'prompt_engineering',
    sections: [
      ...createTemplateArea({
        id: 'zero_shot_role',
        name: 'Role Definition',
        content: 'Definiere die Rolle und Expertise der KI',
        order: 1,
        children: [
          {
            name: 'Expert Role',
            content: 'Du bist ein [spezifische Rolle] mit [Jahre] Jahren Erfahrung in [Bereich].',
            isRequired: true
          },
          {
            name: 'Perspective',
            content: 'Dein Ansatz ist [methodischer Ansatz] und du konzentrierst dich auf [Schwerpunkte].',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'zero_shot_context',
        name: 'Context & Background',
        content: 'Stelle relevante Hintergrundinformationen bereit',
        order: 2,
        children: [
          {
            name: 'Situation Description',
            content: '[Beschreibung der aktuellen Situation und des Kontexts]',
            isRequired: true
          },
          {
            name: 'Constraints',
            content: 'Wichtige Einschränkungen: [Beschränkungen und Limitierungen]',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'zero_shot_task',
        name: 'Task Definition',
        content: 'Definiere klar was getan werden soll',
        order: 3,
        children: [
          {
            name: 'Primary Objective',
            content: 'Erstelle/Analysiere/Entwickle [spezifisches Deliverable] das [messbares Ergebnis] erreicht.',
            isRequired: true
          },
          {
            name: 'Success Criteria',
            content: 'Erfolgskriterien: [spezifische Metriken oder Qualitätsstandards]',
            isRequired: false
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'zero_shot_format',
        name: 'Output Format',
        content: 'Spezifiziere wie die Antwort strukturiert sein soll',
        order: 4,
        children: [
          {
            name: 'Structure Requirements',
            content: 'Formatiere die Antwort als [Format] mit [spezifischen Elementen].',
            isRequired: true
          },
          {
            name: 'Style Guidelines',
            content: 'Verwende einen [Ton] Ton und [Detailgrad] Detailgrad.',
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
    description: 'Umfassendes Framework für komplexe Aufgaben: Role, Objective, Scenario, Expected Solution, Steps.',
    complexity: 'medium',
    estimatedTime: '30-45 Minuten',
    type: 'roses_framework',
    category: 'prompt_engineering',
    sections: [
      ...createTemplateArea({
        id: 'roses_role',
        name: 'Role (R)',
        content: 'Definiere die Expertise und Identität der KI',
        order: 1,
        children: [
          {
            name: 'Professional Identity',
            content: 'Du bist ein [spezifischer Beruf] mit [X Jahren] Erfahrung in [Branche/Bereich] und einem Hintergrund in [relevante Expertise].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_objective',
        name: 'Objective (O)',
        content: 'Stelle das Ziel klar dar',
        order: 2,
        children: [
          {
            name: 'Clear Goal',
            content: 'Erstelle/Entwickle/Analysiere [spezifisches Deliverable] das [messbares Ergebnis] für [Zielgruppe/Unternehmen] erreicht.',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_scenario',
        name: 'Scenario (S)',
        content: 'Beschreibe die Situation',
        order: 3,
        children: [
          {
            name: 'Current Situation',
            content: '[Unternehmen/Team-Beschreibung] steht vor [aktuelle Situation]. Die wichtigsten Einschränkungen umfassen [Limitierungen]. Verfügbare Ressourcen umfassen [Tools/Daten/Team/Budget].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_expected',
        name: 'Expected Solution (E)',
        content: 'Spezifiziere das gewünschte Ergebnis',
        order: 4,
        children: [
          {
            name: 'Deliverable Format',
            content: 'Liefere ein [Format] das folgende Elemente enthält: [spezifisches Element 1], [spezifisches Element 2], und [spezifisches Element 3]. Die Lösung sollte [Länge/Detailgrad] sein und sich auf [Schlüsselprioritäten] konzentrieren.',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'roses_steps',
        name: 'Steps (S)',
        content: 'Liste den zu befolgenden Prozess auf',
        order: 5,
        children: [
          {
            name: 'Process Steps',
            content: '1. Beginne mit [erster Schritt] unter Berücksichtigung [relevante Faktoren]\n2. Dann [zweiter Schritt] mit Schwerpunkt auf [wichtiger Aspekt]\n3. Als nächstes [dritter Schritt] unter Verwendung [spezifische Methodik/Ansatz]\n4. Schließlich [finaler Schritt] um [Qualitätskontrolle] sicherzustellen',
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
    id: 'chain_of_thought',
    name: 'Chain-of-Thought Framework',
    description: 'Strukturiertes Reasoning-Framework für komplexe analytische Aufgaben mit expliziten Denkschritten.',
    complexity: 'medium',
    estimatedTime: '20-40 Minuten',
    type: 'chain_of_thought',
    category: 'prompt_engineering',
    sections: [
      ...createTemplateArea({
        id: 'cot_problem',
        name: 'Problem Statement',
        content: 'Definiere das zu lösende Problem klar',
        order: 1,
        children: [
          {
            name: 'Problem Description',
            content: '[Detaillierte Problembeschreibung mit allen relevanten Informationen]',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'cot_reasoning',
        name: 'Step-by-Step Reasoning',
        content: 'Führe die KI durch explizite Denkschritte',
        order: 2,
        children: [
          {
            name: 'Reasoning Process',
            content: 'Um dieses Problem zu lösen, werde ich es Schritt für Schritt durchdenken:\n\nSchritt 1: [Erster Denkschritt]\nSchritt 2: [Zweiter Denkschritt]\nSchritt 3: [Dritter Denkschritt]\nSchritt 4: [Vierter Denkschritt]\n\nDaher ist die Antwort [Schlussfolgerung].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'cot_verification',
        name: 'Verification & Quality Check',
        content: 'Überprüfe die Lösung auf Fehler',
        order: 3,
        children: [
          {
            name: 'Self-Check',
            content: 'Überprüfe deine Antwort auf:\n- Sachliche Richtigkeit\n- Logische Konsistenz\n- Direkte Relevanz zur ursprünglichen Frage\n- Angemessenen Detailgrad',
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
    id: 'marketing_prompt_template',
    name: 'Marketing Content Framework',
    description: 'Spezialisierte Prompt-Vorlage für Marketing-Content-Erstellung mit Zielgruppen-Fokus.',
    complexity: 'low',
    estimatedTime: '15-25 Minuten',
    type: 'prompt_framework',
    category: 'prompt_engineering',
    sections: [
      ...createTemplateArea({
        id: 'marketing_role',
        name: 'Marketing Expert Role',
        content: 'Definiere Marketing-Expertise',
        order: 1,
        children: [
          {
            name: 'Marketing Specialist',
            content: 'Du bist ein [spezifische Marketing-Rolle] mit Expertise in [Branche/Kanal]. Du spezialisierst dich auf [Marketing-Bereich] und hast Erfahrung mit [spezifische Zielgruppen].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'marketing_content',
        name: 'Content Specifications',
        content: 'Spezifiziere den gewünschten Content',
        order: 2,
        children: [
          {
            name: 'Content Type & Audience',
            content: 'Ich benötige [spezifischer Content-Typ] für [Produkt/Kampagne] mit Fokus auf [Zielgruppe]. Unsere Kernbotschaft ist [Wertversprechen].',
            isRequired: true
          },
          {
            name: 'Goals & Requirements',
            content: 'Der Content sollte [spezifische Ziele] erreichen und [erforderliche Elemente] enthalten. Formatiere es als [Struktur-Details] mit einem [Ton] Ton.',
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
    id: 'business_analysis_prompt',
    name: 'Business Analysis Framework',
    description: 'Strukturierte Vorlage für Geschäftsanalysen mit datengetriebenen Insights.',
    complexity: 'medium',
    estimatedTime: '25-40 Minuten',
    type: 'prompt_framework',
    category: 'prompt_engineering',
    sections: [
      ...createTemplateArea({
        id: 'business_analyst_role',
        name: 'Business Analyst Role',
        content: 'Definiere Business-Analyse-Expertise',
        order: 1,
        children: [
          {
            name: 'Analyst Expertise',
            content: 'Du bist ein [Typ von Analyst] spezialisiert auf [Branche/Methodik]. Du hast umfangreiche Erfahrung in [Analyse-Bereichen] und verwendest [analytische Frameworks].',
            isRequired: true
          }
        ]
      }),
      
      ...createTemplateArea({
        id: 'business_analysis_scope',
        name: 'Analysis Scope',
        content: 'Definiere Umfang und Kontext der Analyse',
        order: 2,
        children: [
          {
            name: 'Analysis Request',
            content: 'Ich benötige eine Analyse zu [Thema/Problem] innerhalb [Kontext/Zeitraum]. Die zu berücksichtigenden Schlüsselfaktoren sind [Variablen/Einschränkungen].',
            isRequired: true
          },
          {
            name: 'Output Requirements',
            content: 'Präsentiere deine Analyse als [Format] mit [spezifischen Abschnitten]. Inkludiere [Datenpunkte/Metriken] und Empfehlungen für [Ziel].',
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
