import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, LinkingOptions} from '@react-navigation/native';
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
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#0A0A1A'},
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{gestureEnabled: false}}
        />
        {/* FullPlayer, Profile 화면은 추후 추가 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
