import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#94a3b8',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  todoItemCompleted: {
    backgroundColor: '#f8fafc',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#7c83ff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#635bff',
    borderColor: '#635bff',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  todoMain: {
    flex: 1,
    marginRight: 8,
  },
  todoText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    lineHeight: 22,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dueDate: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  dueDateCompleted: {
    color: '#94a3b8',
  },
  dueDateOverdue: {
    color: '#b91c1c',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  subtaskCheck: {
    fontSize: 18,
  },
  subtaskText: {
    flex: 1,
    fontSize: 13,
  },
  subtaskInput: {
    borderBottomWidth: 1,
    paddingVertical: 5,
    fontSize: 12,
    marginTop: 6,
  },
  todoActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  moveButton: {
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveButtonText: {
    fontSize: 20,
    fontWeight: '800',
  },
});