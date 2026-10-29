import { PropsWithChildren } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { ActionButton } from '../components/common/ActionButton/ActionButton';
import { useBiometricLock } from './BiometricLockProvider';
import { styles } from './BiometricLockGate.styles';

export function BiometricLockGate({ children }: PropsWithChildren) {
  const { authMethod, isAuthenticating, isLocked, isReady, message, unlock } = useBiometricLock();

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#aeb6ff" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.root, isLocked && { display: 'none' }]}>{children}</View>
      {isLocked ? (
        <View accessibilityViewIsModal style={styles.locked}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>Task Flow is locked</Text>
          <Text style={styles.description}>
            {authMethod === 'deviceCredential'
              ? 'Use your device PIN, pattern, or password to continue.'
              : 'Use fingerprint, face, or your device passcode to continue.'}
          </Text>
          <ActionButton
            disabled={isAuthenticating}
            label={isAuthenticating ? 'Waiting…' : 'Unlock'}
            onPress={() => void unlock()}
            variant="primary"
          />
          {message ? <Text accessibilityRole="alert" style={styles.error}>{message}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}