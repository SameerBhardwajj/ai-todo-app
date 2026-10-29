import {
  categoryOptions,
  Subtask,
  Task,
  TaskCategory,
  TaskFilter,
} from './types';
import { normalizeDate } from '../utils/date';

const isTaskCategory = (value: unknown): value is TaskCategory =>
  typeof value === 'string' && categoryOptions.includes(value as TaskCategory);

const normalizeSubtasks = (source: unknown): Subtask[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.flatMap((item, index) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const candidate = item as Partial<Subtask>;
    const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';

    if (!text) {
      return [];
    }

    return [{
      id: typeof candidate.id === 'string' ? candidate.id : `subtask-${index}-${Date.now()}`,
      text,
      completed: Boolean(candidate.completed),
      order: typeof candidate.order === 'number' ? candidate.order : index,
      createdAt: typeof candidate.createdAt === 'number' ? candidate.createdAt : Date.now(),
    }];
  });
};

const normalizeReminder = (source: unknown): Task['reminder'] => {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const candidate = source as Partial<NonNullable<Task['reminder']>>;
  const at = typeof candidate.at === 'string' ? candidate.at.trim() : '';

  return at && !Number.isNaN(new Date(at).getTime())
    ? {
      at,
      enabled: candidate.enabled !== false,
      ...(typeof candidate.notificationId === 'string' && candidate.notificationId
        ? { notificationId: candidate.notificationId }
        : {}),
      }
    : null;
};

export const normalizeTaskList = (source: unknown): Task[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.flatMap((item, index) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const candidate = item as Partial<Task>;
    const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';

    if (!text) {
      return [];
    }

    return [{
      id: typeof candidate.id === 'string' ? candidate.id : `task-${index}-${Date.now()}`,
      text,
      completed: Boolean(candidate.completed),
      category: isTaskCategory(candidate.category) ? candidate.category : 'General',
      dueDate: normalizeDate(candidate.dueDate),
      reminder: normalizeReminder(candidate.reminder),
      subtasks: normalizeSubtasks(candidate.subtasks),
      order: typeof candidate.order === 'number' ? candidate.order : index,
      createdAt: typeof candidate.createdAt === 'number' ? candidate.createdAt : Date.now(),
    } satisfies Task];
  });
};

export const orderTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((first, second) => {
    if (first.order !== second.order) {
      return first.order - second.order;
    }

    if (first.completed !== second.completed) {
      return Number(first.completed) - Number(second.completed);
    }

    return second.createdAt - first.createdAt;
  });

export const searchTasks = (tasks: Task[], query: string): Task[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return orderTasks(tasks);
  }

  return orderTasks(tasks).filter((task) => {
    const subtaskText = task.subtasks.map((subtask) => subtask.text).join(' ');
    return `${task.text} ${task.category} ${subtaskText}`.toLocaleLowerCase().includes(normalizedQuery);
  });
};

export const selectTasks = (tasks: Task[], filter: TaskFilter, query = ''): Task[] => {
  const filtered = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return searchTasks(filtered, query);
};

export const reorderTasks = (tasks: Task[], fromIndex: number, toIndex: number): Task[] => {
  const ordered = orderTasks(tasks);

  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= ordered.length ||
    toIndex >= ordered.length ||
    fromIndex === toIndex
  ) {
    return ordered;
  }

  const [moved] = ordered.splice(fromIndex, 1);
  ordered.splice(toIndex, 0, moved);
  return ordered.map((task, index) => ({ ...task, order: index }));
};

export const addSubtask = (task: Task, text: string): Task => {
  const trimmed = text.trim();
  if (!trimmed) return task;

  return {
    ...task,
    subtasks: [
      ...task.subtasks,
      {
        id: `subtask-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: trimmed,
        completed: false,
        order: task.subtasks.length,
        createdAt: Date.now(),
      },
    ],
  };
};

export const toggleSubtask = (task: Task, subtaskId: string): Task => ({
  ...task,
  subtasks: task.subtasks.map((subtask) =>
    subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
  ),
});
