import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef4ff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  backText: {
    color: '#4338ca',
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '800',
  },
  section: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#94a3b8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  label: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  status: {
    marginTop: 14,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
  },
  error: {
    marginTop: 12,
    color: '#b91c1c',
    fontSize: 13,
    lineHeight: 19,
  },
});