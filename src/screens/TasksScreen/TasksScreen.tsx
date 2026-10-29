import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../navigation/types';
import { Task, TaskCategory, TaskFilter } from '../../tasks/types';
import { TaskBoard } from '../../tasks/components/TaskBoard/TaskBoard';
import { TaskForm } from '../../tasks/components/TaskForm/TaskForm';
import { useTasks } from '../../tasks/hooks/useTasks';
import { formatDateInput, getTomorrowDateInput, normalizeDate } from '../../utils/date';
import { darkTheme, lightTheme } from '../../theme/theme';
import { styles } from './styles';

type TasksNavigation = NativeStackNavigationProp<RootStackParamList, 'Tasks'>;

export function TasksScreen() {
  const navigation = useNavigation<TasksNavigation>();
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(getTomorrowDateInput);
  const [category, setCategory] = useState<TaskCategory>('General');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;
  const tasks = useTasks(filter, query);

  const resetForm = () => {
    setText('');
    setDueDate(getTomorrowDateInput());
    setCategory('General');
    setEditingId(null);
  };

  const saveTask = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const input = { category, dueDate: normalizeDate(dueDate), text: trimmedText };
    if (editingId) {
      tasks.editTask(editingId, input);
    } else {
      tasks.createTask(input);
    }
    resetForm();
  };

  const editTask = (task: Task) => {
    setEditingId(task.id);
    setText(task.text);
    setCategory(task.category);
    setDueDate(formatDateInput(task.dueDate));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Focus</Text>
              <Text style={[styles.title, { color: theme.text }]}>Task flow</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                accessibilityLabel="Open settings"
                accessibilityRole="button"
                onPress={() => navigation.navigate('Settings')}
                style={[styles.themeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Text style={{ color: theme.text }}>⚙</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                accessibilityRole="switch"
                accessibilityState={{ checked: darkMode }}
                onPress={() => setDarkMode((value) => !value)}
                style={[styles.themeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Text style={{ color: theme.text }}>{darkMode ? '☀' : '☾'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryLabel, { color: theme.mutedText }]}>Open</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>{tasks.remainingCount}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryLabel, { color: theme.mutedText }]}>Done</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>{tasks.completedCount}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryLabel, { color: theme.mutedText }]}>All</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>{tasks.allTaskCount}</Text>
            </View>
          </View>

          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('Payments')} style={{ padding: 16, marginBottom: 16, borderRadius: 16, backgroundColor: theme.accent }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Payments and history</Text>
            <Text style={{ color: '#fff', marginTop: 4 }}>Pay with any installed UPI app</Text>
          </TouchableOpacity>

          <TaskForm
            category={category}
            dueDate={dueDate}
            editing={editingId !== null}
            onCancel={resetForm}
            onCategoryChange={setCategory}
            onDueDateChange={setDueDate}
            onSave={saveTask}
            onTextChange={setText}
            text={text}
            theme={theme}
          />

          <TaskBoard
            filter={filter}
            onAddSubtask={tasks.addTaskSubtask}
            onClearCompleted={tasks.clearCompleted}
            onDeleteTask={tasks.deleteTask}
            onEditTask={editTask}
            onFilterChange={setFilter}
            onMoveTask={tasks.moveTask}
            onQueryChange={setQuery}
            onReorderTasks={tasks.reorderTasksById}
            onSubtaskToggle={tasks.toggleTaskSubtask}
            onTaskToggle={tasks.toggleTask}
            query={query}
            showClearCompleted={tasks.hasCompletedTasks}
            tasks={tasks.filteredTasks}
            theme={theme}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}