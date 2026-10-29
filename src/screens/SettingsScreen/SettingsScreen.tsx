import { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppState, Platform, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../../navigation/types';
import { useBiometricLock } from '../../auth/BiometricLockProvider';
import { ActionButton } from '../../components/common/ActionButton/ActionButton';
import { styles } from './styles';

type SettingsNavigation = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNavigation>();
  const { authMethod, available, clearMessage, disableLock, enableLock, lockEnabled, message, openAuthenticationSettings, refreshAvailability } = useBiometricLock();
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    void refreshAvailability();
  }, [refreshAvailability]));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshAvailability();
    });
    return () => subscription.remove();
  }, [refreshAvailability]);

  const openDeviceSecuritySettings = async () => {
    await openAuthenticationSettings();
  };

  const changeLock = async (enabled: boolean) => {
    setSaving(true);
    clearMessage();
    try {
      if (enabled) {
        await enableLock();
      } else {
        await disableLock();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel="Back to tasks" accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Device authentication lock</Text>
              <Text style={styles.description}>Require your enrolled biometric or device PIN when reopening the app.</Text>
            </View>
            <Switch
              accessibilityLabel="Device authentication app lock"
              disabled={!available || saving}
              onValueChange={(enabled) => void changeLock(enabled)}
              value={lockEnabled}
            />
          </View>
          <Text style={styles.status}>
            {authMethod === 'biometrics'
              ? 'Enrolled biometrics are available. Your device credential can be used as a system fallback.'
              : authMethod === 'deviceCredential'
                ? 'No biometrics are enrolled. Your device PIN, pattern, or password will authenticate the app lock.'
                : Platform.OS === 'ios'
                  ? 'No device credential or biometrics detected. Open Settings, then configure a passcode or Face ID. iOS does not allow apps to open that page directly.'
                  : 'No device credential or biometrics detected. Set up a screen lock or biometric in device settings.'}
          </Text>
          {!available ? (
            <ActionButton
              label={Platform.OS === 'android' ? 'Set up device authentication' : 'Open Settings'}
              onPress={() => void openDeviceSecuritySettings()}
              style={{ marginTop: 16 }}
              variant="primary"
            />
          ) : null}
          {message ? <Text accessibilityRole="alert" style={styles.error}>{message}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}