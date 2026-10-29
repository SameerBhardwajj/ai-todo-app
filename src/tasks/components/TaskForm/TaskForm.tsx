import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ActionButton } from '../../../components/common/ActionButton/ActionButton';
import { Theme } from '../../../theme/theme';
import { categoryOptions, TaskCategory } from '../../types';
import { styles } from './styles';

type TaskFormProps = {
  category: TaskCategory;
  dueDate: string;
  editing: boolean;
  onCancel: () => void;
  onCategoryChange: (category: TaskCategory) => void;
  onDueDateChange: (value: string) => void;
  onSave: () => void;
  onTextChange: (value: string) => void;
  text: string;
  theme: Theme;
};

export function TaskForm({
  category,
  dueDate,
  editing,
  onCancel,
  onCategoryChange,
  onDueDateChange,
  onSave,
  onTextChange,
  text,
  theme,
}: TaskFormProps) {
  return (
    <View style={[styles.formCard, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{editing ? 'Update task' : 'Add a task'}</Text>
      <TextInput
        value={text}
        onChangeText={onTextChange}
        placeholder="What needs to get done?"
        placeholderTextColor="#9aa0b5"
        style={[styles.input, { color: theme.text, backgroundColor: theme.mutedSurface, borderColor: theme.border }]}
        multiline
      />

      <Text style={[styles.fieldLabel, { color: theme.mutedText }]}>Category</Text>
      <View style={styles.categoryRow}>
        {categoryOptions.map((item) => (
          <TouchableOpacity
            key={item}
            accessibilityRole="button"
            onPress={() => onCategoryChange(item)}
            style={[
              styles.categoryChip,
              category === item && styles.categoryChipSelected,
              {
                borderColor: category === item ? theme.accent : theme.border,
                backgroundColor: category === item ? theme.accentSoft : theme.mutedSurface,
              },
            ]}
          >
            <Text style={[styles.categoryChipText, { color: category === item ? theme.accent : theme.mutedText }]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.fieldLabel, { color: theme.mutedText }]}>Due date</Text>
      <TextInput
        value={dueDate}
        onChangeText={onDueDateChange}
        placeholder="DD-MM-YYYY"
        placeholderTextColor="#9aa0b5"
        style={[styles.input, { color: theme.text, backgroundColor: theme.mutedSurface, borderColor: theme.border }]}
        autoCapitalize="none"
        keyboardType="numbers-and-punctuation"
      />

      <View style={styles.formActions}>
        {editing ? (
          <ActionButton
            label="Cancel"
            onPress={onCancel}
            style={{ backgroundColor: theme.mutedSurface }}
            textStyle={{ color: theme.mutedText }}
            variant="secondary"
          />
        ) : null}
        <ActionButton
          disabled={!text.trim()}
          label={editing ? 'Save task' : 'Add task'}
          onPress={onSave}
          style={{ backgroundColor: theme.accent }}
          variant="primary"
        />
      </View>
    </View>
  );
}