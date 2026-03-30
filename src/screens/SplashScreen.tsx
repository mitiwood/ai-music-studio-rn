import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {Spacing, Radius} from '../theme/spacing';
import {useAuthStore} from '../stores';
import {APP_NAME} from '../utils/constants';

export const SplashScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user, isLoading, loadUser} = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoading, user, navigation]);

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.bgDark]}
      style={styles.container}>
      <View style={styles.logoBox}>
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          style={styles.logoGradient}>
          <Text style={styles.logoEmoji}>{'\ud83c\udfb5'}</Text>
        </LinearGradient>
      </View>
      <Text style={[Typography.h1, styles.appName]}>{APP_NAME}</Text>
      <Text style={[Typography.caption, styles.subtitle]}>
        AI로 나만의 음악을 만들어보세요
      </Text>
      <ActivityIndicator
        color={Colors.primary}
        size="large"
        style={styles.loader}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    marginBottom: Spacing.xl,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    color: Colors.text1,
    marginTop: Spacing.lg,
  },
  subtitle: {
    color: Colors.text2,
    marginTop: Spacing.sm,
  },
  loader: {
    marginTop: Spacing.xxxl,
  },
});
