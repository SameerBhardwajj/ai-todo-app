import AsyncStorage from '@react-native-async-storage/async-storage';
import * as IntentLauncher from 'expo-intent-launcher';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState, AppStateStatus, Linking, Platform } from 'react-native';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';

const BIOMETRIC_LOCK_KEY = '@todo-app:biometric-lock:v1';

type BiometricLockContextValue = {
  available: boolean;
  authMethod: 'biometrics' | 'deviceCredential' | 'none';
  clearMessage: () => void;
  disableLock: () => Promise<void>;
  enableLock: () => Promise<boolean>;
  isAuthenticating: boolean;
  isLocked: boolean;
  isReady: boolean;
  lockEnabled: boolean;
  message: string | null;
  openAuthenticationSettings: () => Promise<void>;
  refreshAvailability: () => Promise<boolean>;
  unlock: () => Promise<boolean>;
};

const BiometricLockContext = createContext<BiometricLockContextValue | null>(null);

export function BiometricLockProvider({ children }: PropsWithChildren) {
  const [available, setAvailable] = useState(false);
  const [authMethod, setAuthMethod] = useState<BiometricLockContextValue['authMethod']>('none');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [lockEnabled, setLockEnabled] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const enabledRef = useRef(false);
  const lockedRef = useRef(false);
  const authInFlightRef = useRef(false);
  const autoPromptAttemptedRef = useRef(false);

  const updateLocked = useCallback((locked: boolean) => {
    lockedRef.current = locked;
    setIsLocked(locked);
  }, []);

  const updateEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
    setLockEnabled(enabled);
  }, []);

  const refreshAvailability = useCallback(async () => {
    const supportedPlatform = Platform.OS === 'android' || Platform.OS === 'ios';
    if (!supportedPlatform) {
      setAvailable(false);
      setAuthMethod('none');
      return false;
    }

    const [hasHardware, isBiometricEnrolled, enrolledLevel] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.getEnrolledLevelAsync(),
    ]);
    const biometricsAvailable = hasHardware && isBiometricEnrolled
      && (enrolledLevel === LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK
        || enrolledLevel === LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG);
    const deviceCredentialAvailable = enrolledLevel === LocalAuthentication.SecurityLevel.SECRET;
    const deviceAvailable = biometricsAvailable || deviceCredentialAvailable;

    setAvailable(deviceAvailable);
    setAuthMethod(biometricsAvailable ? 'biometrics' : deviceCredentialAvailable ? 'deviceCredential' : 'none');
    return deviceAvailable;
  }, []);

  const unlock = useCallback(async (): Promise<boolean> => {
    if (authInFlightRef.current) return false;

    authInFlightRef.current = true;
    setIsAuthenticating(true);
    setMessage(null);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Task Flow',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use device passcode',
        biometricsSecurityLevel: 'weak',
      });

      if (result.success) {
        updateLocked(false);
        setMessage(null);
        return true;
      }

      if (result.error !== 'user_cancel' && result.error !== 'system_cancel' && result.error !== 'app_cancel') {
        setMessage('Authentication failed. Try again or use your device passcode.');
      }
      return false;
    } catch {
      setMessage('Biometric authentication is unavailable right now.');
      return false;
    } finally {
      authInFlightRef.current = false;
      setIsAuthenticating(false);
    }
  }, [updateLocked]);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        const [deviceAvailable, savedPreference] = await Promise.all([
          refreshAvailability(),
          AsyncStorage.getItem(BIOMETRIC_LOCK_KEY),
        ]);
        if (!active) return;

        const shouldLock = savedPreference === 'enabled' && deviceAvailable;
        updateEnabled(shouldLock);
        updateLocked(shouldLock);

        if (savedPreference === 'enabled' && !deviceAvailable) {
          await AsyncStorage.removeItem(BIOMETRIC_LOCK_KEY);
          setMessage('Biometric lock was turned off because no enrolled biometrics are available.');
        }
      } catch {
        if (!active) return;
        updateEnabled(false);
        updateLocked(false);
        setMessage('Could not load biometric lock settings.');
      } finally {
        if (active) setIsReady(true);
      }
    };

    void initialize();
    return () => {
      active = false;
    };
  }, [refreshAvailability, updateEnabled, updateLocked]);

  useEffect(() => {
    if (isReady && lockEnabled && isLocked && !autoPromptAttemptedRef.current && AppState.currentState === 'active') {
      autoPromptAttemptedRef.current = true;
      void unlock();
    }
  }, [isReady, isLocked, lockEnabled, unlock]);

  useEffect(() => {
    let previousState: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasActive = previousState === 'active';
      previousState = nextState;

      if (wasActive && nextState !== 'active' && enabledRef.current && !authInFlightRef.current) {
        autoPromptAttemptedRef.current = false;
        updateLocked(true);
      }

      if (nextState === 'active' && enabledRef.current && lockedRef.current && !autoPromptAttemptedRef.current) {
        autoPromptAttemptedRef.current = true;
        void unlock();
      }
    });

    return () => subscription.remove();
  }, [unlock, updateLocked]);

  const enableLock = useCallback(async (): Promise<boolean> => {
    try {
      if (!(await refreshAvailability())) {
        setMessage('Set up a device PIN, pattern, password, fingerprint, or face unlock first.');
        return false;
      }

      autoPromptAttemptedRef.current = true;
      const authenticated = await unlock();
      if (!authenticated) return false;

      await AsyncStorage.setItem(BIOMETRIC_LOCK_KEY, 'enabled');
      updateEnabled(true);
      updateLocked(false);
      setMessage(null);
      return true;
    } catch {
      setMessage('Could not enable biometric lock. Please try again.');
      return false;
    }
  }, [refreshAvailability, unlock, updateEnabled, updateLocked]);

  const disableLock = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(BIOMETRIC_LOCK_KEY);
      updateEnabled(false);
      updateLocked(false);
      autoPromptAttemptedRef.current = true;
      setMessage(null);
    } catch {
      setMessage('Could not disable biometric lock. Please try again.');
    }
  }, [updateEnabled, updateLocked]);

  const clearMessage = useCallback(() => setMessage(null), []);

  const openAuthenticationSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        try {
          await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.BIOMETRIC_ENROLL);
        } catch {
          await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.SECURITY_SETTINGS);
        }
      } else if (Platform.OS === 'ios') {
        await Linking.openSettings();
      }
    } catch {
      setMessage('Could not open device security settings. Open Settings and configure a screen lock or biometrics.');
    }
  }, []);

  return (
    <BiometricLockContext.Provider
      value={{ available, authMethod, clearMessage, disableLock, enableLock, isAuthenticating, isLocked, isReady, lockEnabled, message, openAuthenticationSettings, refreshAvailability, unlock }}
    >
      {children}
    </BiometricLockContext.Provider>
  );
}

export function useBiometricLock(): BiometricLockContextValue {
  const value = useContext(BiometricLockContext);
  if (!value) {
    throw new Error('useBiometricLock must be used within BiometricLockProvider.');
  }
  return value;
}