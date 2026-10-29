import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    minWidth: 96,
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    minWidth: 0,
    minHeight: 0,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  primary: {
    backgroundColor: '#635bff',
  },
  secondary: {
    backgroundColor: '#f1f5f9',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  compactLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryLabel: {
    color: '#475569',
  },
  dangerLabel: {
    color: '#b91c1c',
  },
});