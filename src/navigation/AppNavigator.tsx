import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BiometricLockGate } from '../auth/BiometricLockGate';
import { BiometricLockProvider } from '../auth/BiometricLockProvider';
import { SettingsScreen } from '../screens/SettingsScreen/SettingsScreen';
import { TasksScreen } from '../screens/TasksScreen/TasksScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen/PaymentsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <SafeAreaProvider>
      <BiometricLockProvider>
        <BiometricLockGate>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Tasks" screenOptions={{ headerShown: false }}>
              <Stack.Screen component={TasksScreen} name="Tasks" />
              <Stack.Screen component={SettingsScreen} name="Settings" />
              <Stack.Screen component={PaymentsScreen} name="Payments" />
            </Stack.Navigator>
          </NavigationContainer>
        </BiometricLockGate>
      </BiometricLockProvider>
    </SafeAreaProvider>
  );
}