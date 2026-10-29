import { TaskCategory } from '../tasks/types';

export type Theme = {
  background: string;
  surface: string;
  mutedSurface: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  accentSoft: string;
  danger: string;
  dangerSoft: string;
};

export const lightTheme: Theme = {
  background: '#eef4ff',
  surface: '#ffffff',
  mutedSurface: '#f8fafc',
  text: '#111827',
  mutedText: '#64748b',
  border: '#dfe3f2',
  accent: '#635bff',
  accentSoft: '#e0e7ff',
  danger: '#b91c1c',
  dangerSoft: '#fee2e2',
};

export const darkTheme: Theme = {
  background: '#101827',
  surface: '#182235',
  mutedSurface: '#202d43',
  text: '#f8fafc',
  mutedText: '#a8b4c7',
  border: '#334155',
  accent: '#aeb6ff',
  accentSoft: '#303b72',
  danger: '#fca5a5',
  dangerSoft: '#542938',
};

export const categoryColors: Record<TaskCategory, { background: string; text: string; border: string }> = {
  General: { background: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  Work: { background: '#ecfeff', text: '#0f766e', border: '#a5f3fc' },
  Personal: { background: '#fef3c7', text: '#b45309', border: '#fcd34d' },
  Health: { background: '#dcfce7', text: '#15803d', border: '#86efac' },
  Study: { background: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' },
  Errands: { background: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },
};
