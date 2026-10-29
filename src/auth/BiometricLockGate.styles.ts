import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101827',
  },
  locked: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#101827',
  },
  icon: {
    fontSize: 42,
    marginBottom: 18,
  },
  title: {
    marginBottom: 8,
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    marginBottom: 24,
    color: '#a8b4c7',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  error: {
    marginTop: 14,
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
  },
});