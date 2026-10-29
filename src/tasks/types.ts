export const TASKS_STORAGE_KEY = '@todo-app:tasks:v2';
export const LEGACY_TASKS_STORAGE_KEY = '@todo-app:tasks:v1';
export const TASKS_SCHEMA_VERSION = 2 as const;

export const categoryOptions = ['General', 'Work', 'Personal', 'Health', 'Study', 'Errands'] as const;
export type TaskCategory = (typeof categoryOptions)[number];

export type Reminder = {
  at: string;
  enabled: boolean;
  notificationId?: string;
};

export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
  order: number;
  createdAt: number;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  category: TaskCategory;
  dueDate: string | null;
  reminder: Reminder | null;
  subtasks: Subtask[];
  order: number;
  createdAt: number;
};

export type PersistedTasks = {
  version: typeof TASKS_SCHEMA_VERSION;
  tasks: Task[];
};

export type TaskFilter = 'all' | 'active' | 'completed';