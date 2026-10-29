import { useEffect, useMemo, useState } from 'react';

import { addSubtask, orderTasks, reorderTasks, selectTasks, toggleSubtask } from '../state';
import { readTasks, writeTasks } from '../storage';
import { Task, TaskCategory, TaskFilter } from '../types';

export type NewTaskInput = {
  category: TaskCategory;
  dueDate: string | null;
  text: string;
};

export function useTasks(filter: TaskFilter, query: string) {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    const hydrate = async () => {
      try {
        const saved = await readTasks();
        if (isActive) setAllTasks(saved.tasks);
      } catch (error) {
        console.warn('Failed to load tasks', error);
      } finally {
        if (isActive) setIsLoaded(true);
      }
    };

    void hydrate();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const persistTasks = async () => {
      try {
        await writeTasks(allTasks);
      } catch (error) {
        console.warn('Failed to save tasks', error);
      }
    };

    void persistTasks();
  }, [allTasks, isLoaded]);

  const filteredTasks = useMemo(() => selectTasks(allTasks, filter, query), [allTasks, filter, query]);
  const remainingCount = useMemo(() => allTasks.filter((task) => !task.completed).length, [allTasks]);
  const completedCount = useMemo(() => allTasks.filter((task) => task.completed).length, [allTasks]);

  const createTask = ({ category, dueDate, text }: NewTaskInput) => {
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: text.trim(),
      completed: false,
      category,
      dueDate,
      reminder: null,
      subtasks: [],
      order: allTasks.length ? Math.min(...allTasks.map((item) => item.order)) - 1 : 0,
      createdAt: Date.now(),
    };
    setAllTasks((current) => orderTasks([task, ...current]));
  };

  const updateTask = (id: string, update: (task: Task) => Task) => {
    setAllTasks((current) => current.map((task) => task.id === id ? update(task) : task));
  };

  const editTask = (id: string, input: NewTaskInput) => {
    setAllTasks((current) => current.map((task) => task.id === id
      ? { ...task, text: input.text.trim(), category: input.category, dueDate: input.dueDate }
      : task));
  };

  const toggleTask = (id: string) => {
    updateTask(id, (task) => ({ ...task, completed: !task.completed }));
  };

  const deleteTask = (id: string) => {
    setAllTasks((current) => current.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setAllTasks((current) => current.filter((task) => !task.completed));
  };

  const moveTask = (id: string, direction: -1 | 1) => {
    const ordered = orderTasks(allTasks);
    const fromIndex = ordered.findIndex((task) => task.id === id);
    const toIndex = fromIndex + direction;
    if (fromIndex >= 0 && toIndex >= 0 && toIndex < ordered.length) {
      setAllTasks((current) => reorderTasks(current, fromIndex, toIndex));
    }
  };

  const reorderTasksById = (fromId: string, toId: string) => {
    const ordered = orderTasks(allTasks);
    const fromIndex = ordered.findIndex((task) => task.id === fromId);
    const toIndex = ordered.findIndex((task) => task.id === toId);
    if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
      setAllTasks((current) => reorderTasks(current, fromIndex, toIndex));
    }
  };

  const addTaskSubtask = (taskId: string, text: string) => {
    updateTask(taskId, (task) => addSubtask(task, text));
  };

  const toggleTaskSubtask = (taskId: string, subtaskId: string) => {
    updateTask(taskId, (task) => toggleSubtask(task, subtaskId));
  };

  return {
    addTaskSubtask,
    allTaskCount: allTasks.length,
    clearCompleted,
    completedCount,
    createTask,
    deleteTask,
    editTask,
    filteredTasks,
    hasCompletedTasks: completedCount > 0,
    isLoaded,
    moveTask,
    remainingCount,
    reorderTasksById,
    toggleTask,
    toggleTaskSubtask,
  };
}