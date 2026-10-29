import { Task } from '../tasks/types';

export const normalizeDate = (value: string | null | undefined): string | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const dayFirst = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  let parsed: Date;

  if (dayFirst) {
    parsed = new Date(Number(dayFirst[3]), Number(dayFirst[2]) - 1, Number(dayFirst[1]), 12);
    if (parsed.getDate() !== Number(dayFirst[1]) || parsed.getMonth() !== Number(dayFirst[2]) - 1) {
      return null;
    }
  } else if (isoDate) {
    parsed = new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]), 12);
    if (parsed.getDate() !== Number(isoDate[3]) || parsed.getMonth() !== Number(isoDate[2]) - 1) {
      return null;
    }
  } else if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
    parsed = new Date(trimmed);
  } else {
    return null;
  }

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return `${parsed.getFullYear()}-${`${parsed.getMonth() + 1}`.padStart(2, '0')}-${`${parsed.getDate()}`.padStart(2, '0')}`;
};

export const formatDateInput = (value: string | null | undefined): string => {
  const normalized = normalizeDate(value);
  if (!normalized) {
    return '';
  }

  const [year, month, day] = normalized.split('-');
  return `${day}-${month}-${year}`;
};

export const getTomorrowDateInput = (today = new Date()): string => {
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return `${`${tomorrow.getDate()}`.padStart(2, '0')}-${`${tomorrow.getMonth() + 1}`.padStart(2, '0')}-${tomorrow.getFullYear()}`;
};

export const formatDueDate = (value: string | null): string => {
  if (!value) return 'No due date';

  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return 'No due date';

  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const diffDays = Math.round((targetDate.getTime() - normalizedToday.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';

  const formatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(parsed);
  return diffDays < 0 ? `Overdue · ${formatted}` : formatted;
};

export const getDueDateTone = (task: Pick<Task, 'completed' | 'dueDate'>): 'completed' | 'neutral' | 'overdue' | 'scheduled' => {
  if (task.completed) return 'completed';
  if (!task.dueDate) return 'neutral';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${task.dueDate}T12:00:00`);
  return due.getTime() < today.getTime() ? 'overdue' : 'scheduled';
};