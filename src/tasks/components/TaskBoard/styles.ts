import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listHeaderRow: {
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  clearButton: {
    marginBottom: 12,
  },
  clearButtonText: {
    color: '#635bff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 8,
    gap: 12,
  },
  emptyState: {
    backgroundColor: '#f8f9ff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  emptyStateIcon: {
    fontSize: 36,
    color: '#7c83ff',
    marginBottom: 10,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748b',
    textAlign: 'center',
  },
});