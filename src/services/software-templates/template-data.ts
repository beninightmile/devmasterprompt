
import { PromptSection } from '@/types/prompt';

export const webAppBasicSections: PromptSection[] = [
  {
    id: crypto.randomUUID(),
    name: 'Projektname',
    content: 'Moderne Web-Anwendung',
    order: 1,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Beschreibung',
    content: 'Eine benutzerfreundliche Web-Anwendung mit modernen Technologien und responsivem Design.',
    order: 2,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Technologie-Stack',
    content: 'React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI',
    order: 3,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Architektur',
    content: 'Modulare Komponenten-Architektur mit klarer Trennung von Präsentation und Logik.',
    order: 4,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'UI/UX Design',
    content: 'Clean, moderne Benutzeroberfläche mit konsistenten Design-Patterns und guter Accessibility.',
    order: 5,
    isRequired: true,
    level: 1
  }
].map(s => ({ ...s, level: s.level ?? 1 }));

export const mobileAppSections: PromptSection[] = [
  {
    id: crypto.randomUUID(),
    name: 'Projektname',
    content: 'Mobile App Entwicklung',
    order: 1,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Plattform',
    content: 'iOS und Android (React Native)',
    order: 2,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Features',
    content: 'Native Performance, Offline-Funktionalität, Push-Notifications',
    order: 3,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Design Guidelines',
    content: 'Material Design (Android) und Human Interface Guidelines (iOS)',
    order: 4,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Performance',
    content: 'Optimierte Bundle-Größe, schnelle Ladezeiten, effiziente Speichernutzung',
    order: 5,
    isRequired: true,
    level: 1
  }
].map(s => ({ ...s, level: s.level ?? 1 }));

export const apiServiceSections: PromptSection[] = [
  {
    id: crypto.randomUUID(),
    name: 'API Spezifikation',
    content: 'RESTful API mit OpenAPI/Swagger Dokumentation',
    order: 1,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Authentifizierung',
    content: 'JWT-basierte Authentifizierung mit Refresh-Token-Mechanismus',
    order: 2,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Datenbank',
    content: 'PostgreSQL mit Prisma ORM für Type-Safety',
    order: 3,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Error Handling',
    content: 'Strukturierte Fehlerbehandlung mit einheitlichen Error-Responses',
    order: 4,
    isRequired: true,
    level: 1
  },
  {
    id: crypto.randomUUID(),
    name: 'Testing',
    content: 'Unit-Tests, Integration-Tests und API-Dokumentations-Tests',
    order: 5,
    isRequired: true,
    level: 1
  }
].map(s => ({ ...s, level: s.level ?? 1 }));
