import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LEGACY_TASKS_STORAGE_KEY,
  PersistedTasks,
  TASKS_SCHEMA_VERSION,
  TASKS_STORAGE_KEY,
  Task,
} from './types';
import { normalizeTaskList } from './state';

const emptyData = (): PersistedTasks => ({ version: TASKS_SCHEMA_VERSION, tasks: [] });
let pendingWrite: Promise<void> = Promise.resolve();

export const readTasks = async (): Promise<PersistedTasks> => {
  const currentValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

  if (currentValue) {
    try {
      const parsed = JSON.parse(currentValue) as Partial<PersistedTasks>;
      if (parsed.version === TASKS_SCHEMA_VERSION) {
        return {
          version: TASKS_SCHEMA_VERSION,
          tasks: normalizeTaskList(parsed.tasks),
        };
      }
    } catch {
    }
  }

  const legacyValue = await AsyncStorage.getItem(LEGACY_TASKS_STORAGE_KEY);
  if (!legacyValue) {
    return emptyData();
  }

  try {
    const migrated: PersistedTasks = {
      version: TASKS_SCHEMA_VERSION,
      tasks: normalizeTaskList(JSON.parse(legacyValue)),
    };
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return emptyData();
  }
};

export const writeTasks = async (tasks: Task[]): Promise<void> => {
  const data: PersistedTasks = {
    version: TASKS_SCHEMA_VERSION,
    tasks: normalizeTaskList(tasks),
  };
  pendingWrite = pendingWrite.then(() => AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data)));
  await pendingWrite;
};