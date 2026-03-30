import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LinkingOptions} from '@react-navigation/native';
import {SplashScreen} from '../screens/SplashScreen';
import {LoginScreen} from '../screens/auth/LoginScreen';
import {BottomTabNavigator} from './BottomTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  FullPlayer: {trackId: string};
  Profile: {userId?: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['kennymusic://', 'https://ddinggok.com'],
  config: {
    screens: {
      Splash: 'splash',
      Login: 'login',
      MainTabs: {
        path: 'main',
        screens: {
          Community: 'community',
          Create: 'create',
          Library: 'library',
          Settings: 'settings',
        },
      },
      FullPlayer: 'player/:trackId',
      Profile: 'profile/:userId',
    },
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#0A0A1A'},
      }}>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};
