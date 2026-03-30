import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation/AppNavigator';
import {useAuthStore} from './src/stores/authStore';
import {useSettingsStore} from './src/stores/settingsStore';
import {ToastProvider} from './src/components/Toast';

LogBox.ignoreLogs(['Non-serializable values']);

const linking = {
  prefixes: ['kennymusic://', 'https://ddinggok.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Community: 'community',
          Create: 'create',
          Library: 'library',
          Settings: 'settings',
        },
      },
      Profile: 'profile/:name',
    },
  },
};

export default function App() {
  const loadUser = useAuthStore(s => s.loadUser);
  const loadSettings = useSettingsStore(s => s.loadSettings);
  const theme = useSettingsStore(s => s.theme);

  useEffect(() => {
    loadUser();
    loadSettings();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <ToastProvider>
            <StatusBar
              barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
              backgroundColor="transparent"
              translucent
            />
            <AppNavigator />
          </ToastProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
