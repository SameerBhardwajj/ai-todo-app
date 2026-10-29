import { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  PanResponder,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Theme } from '../../../theme/theme';
import { Task, TaskFilter } from '../../types';
import { TaskRow } from '../TaskRow/TaskRow';
import { styles } from './styles';

type TaskBoardProps = {
  filter: TaskFilter;
  onAddSubtask: (taskId: string, text: string) => void;
  onClearCompleted: () => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onFilterChange: (filter: TaskFilter) => void;
  onMoveTask: (taskId: string, direction: -1 | 1) => void;
  onQueryChange: (query: string) => void;
  onReorderTasks: (fromTaskId: string, toTaskId: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
  onTaskToggle: (taskId: string) => void;
  query: string;
  showClearCompleted: boolean;
  tasks: Task[];
  theme: Theme;
};

export function TaskBoard({
  filter,
  onAddSubtask,
  onClearCompleted,
  onDeleteTask,
  onEditTask,
  onFilterChange,
  onMoveTask,
  onQueryChange,
  onReorderTasks,
  onSubtaskToggle,
  onTaskToggle,
  query,
  showClearCompleted,
  tasks,
  theme,
}: TaskBoardProps) {
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);
  const dragOffset = useRef(new Animated.Value(0)).current;

  const emptyState = filter === 'active'
    ? { icon: '✨', title: 'No open tasks', text: 'Everything is clear for now. Add a new task when you are ready.' }
    : filter === 'completed'
      ? { icon: '🎉', title: 'No completed items', text: 'Finish a task to see your progress here.' }
      : { icon: '✓', title: 'Your list is empty', text: 'Create your first task and build momentum for the day.' };

  const finishDrag = (fromIndex: number, toIndex: number) => {
    const fromTaskId = tasks[fromIndex]?.id;
    const toTaskId = tasks[toIndex]?.id;

    if (fromTaskId && toTaskId && fromTaskId !== toTaskId) {
      onReorderTasks(fromTaskId, toTaskId);
    }

    dragIndex.current = null;
    setActiveDragIndex(null);
    dragOffset.setValue(0);
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 8,
      onPanResponderGrant: () => {
        dragIndex.current = index;
        setActiveDragIndex(index);
        dragOffset.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (dragIndex.current !== null) dragOffset.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const target = Math.max(0, Math.min(tasks.length - 1, index + Math.round(gestureState.dy / 96)));
        finishDrag(index, target);
      },
      onPanResponderTerminate: () => finishDrag(index, index),
    });

    return (
      <TaskRow
        dragOffset={dragOffset}
        dragging={activeDragIndex === index}
        index={index}
        item={item}
        onAddSubtask={onAddSubtask}
        onDelete={onDeleteTask}
        onEdit={onEditTask}
        onMove={onMoveTask}
        onSubtaskToggle={onSubtaskToggle}
        onToggle={onTaskToggle}
        panHandlers={panResponder.panHandlers}
        taskCount={tasks.length}
        theme={theme}
      />
    );
  };

  return (
    <>
      <View style={styles.listHeaderRow}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {showClearCompleted ? (
            <TouchableOpacity onPress={onClearCompleted} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear done</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          accessibilityLabel="Search tasks"
          placeholder="Search tasks, categories, or subtasks"
          placeholderTextColor={theme.mutedText}
          style={[styles.searchInput, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
        />
        <View style={styles.filterRow}>
          {(['all', 'active', 'completed'] as TaskFilter[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              accessibilityRole="button"
              onPress={() => onFilterChange(mode)}
              style={[styles.filterChip, { backgroundColor: filter === mode ? theme.accentSoft : theme.surface }]}
            >
              <Text style={[styles.filterChipText, { color: filter === mode ? theme.accent : theme.mutedText }]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>{emptyState.icon}</Text>
          <Text style={styles.emptyStateTitle}>{emptyState.title}</Text>
          <Text style={styles.emptyStateText}>{emptyState.text}</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </>
  );
}