import { Animated, PanResponder, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ActionButton } from '../../../components/common/ActionButton/ActionButton';
import { Theme, categoryColors } from '../../../theme/theme';
import { formatDueDate, getDueDateTone } from '../../../utils/date';
import { Task } from '../../types';
import { styles } from './styles';

type PanHandlers = ReturnType<typeof PanResponder.create>['panHandlers'];

type TaskRowProps = {
  dragOffset: Animated.Value;
  dragging: boolean;
  index: number;
  item: Task;
  onAddSubtask: (taskId: string, text: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onMove: (taskId: string, direction: -1 | 1) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
  onToggle: (taskId: string) => void;
  panHandlers: PanHandlers;
  taskCount: number;
  theme: Theme;
};

export function TaskRow({
  dragOffset,
  dragging,
  index,
  item,
  onAddSubtask,
  onDelete,
  onEdit,
  onMove,
  onSubtaskToggle,
  onToggle,
  panHandlers,
  taskCount,
  theme,
}: TaskRowProps) {
  const colors = categoryColors[item.category];
  const dueDateTone = getDueDateTone(item);

  return (
    <Animated.View
      {...panHandlers}
      style={[styles.todoItem, { backgroundColor: theme.surface }, item.completed && styles.todoItemCompleted, dragging && { transform: [{ translateY: dragOffset }] }]}
    >
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed }}
        onPress={() => onToggle(item.id)}
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
      >
        {item.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </TouchableOpacity>

      <View style={styles.todoMain}>
        <Text style={[styles.todoText, { color: theme.text }, item.completed && styles.todoTextCompleted]}>{item.text}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.categoryBadgeText, { color: colors.text }]}>{item.category}</Text>
          </View>
          <Text style={[styles.dueDate, { color: theme.mutedText }, item.completed && styles.dueDateCompleted, dueDateTone === 'overdue' && styles.dueDateOverdue]}>
            {formatDueDate(item.dueDate)}
          </Text>
        </View>

        {item.subtasks.map((subtask) => (
          <TouchableOpacity
            key={subtask.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: subtask.completed }}
            onPress={() => onSubtaskToggle(item.id, subtask.id)}
            style={styles.subtaskRow}
          >
            <Text style={[styles.subtaskCheck, { color: theme.accent }]}>{subtask.completed ? '✓' : '○'}</Text>
            <Text style={[styles.subtaskText, { color: theme.mutedText }, subtask.completed && styles.todoTextCompleted]}>{subtask.text}</Text>
          </TouchableOpacity>
        ))}

        <TextInput
          accessibilityLabel="New subtask"
          placeholder="Add a subtask..."
          placeholderTextColor={theme.mutedText}
          style={[styles.subtaskInput, { color: theme.text, borderColor: theme.border }]}
          onSubmitEditing={(event) => onAddSubtask(item.id, event.nativeEvent.text)}
        />
      </View>

      <View style={styles.todoActions}>
        <TouchableOpacity accessibilityLabel="Move task up" disabled={index === 0} onPress={() => onMove(item.id, -1)} style={styles.moveButton}>
          <Text style={[styles.moveButtonText, { color: theme.accent }]}>↑</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Move task down" disabled={index === taskCount - 1} onPress={() => onMove(item.id, 1)} style={styles.moveButton}>
          <Text style={[styles.moveButtonText, { color: theme.accent }]}>↓</Text>
        </TouchableOpacity>
        <ActionButton label="Edit" onPress={() => onEdit(item)} size="compact" style={{ backgroundColor: theme.accentSoft }} textStyle={{ color: theme.accent }} variant="secondary" />
        <ActionButton label="Delete" onPress={() => onDelete(item.id)} size="compact" style={{ backgroundColor: theme.dangerSoft }} textStyle={{ color: theme.danger }} variant="danger" />
      </View>
    </Animated.View>
  );
}