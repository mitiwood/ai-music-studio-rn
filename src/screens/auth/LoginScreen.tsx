import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import {Spacing, Radius} from '../../theme/spacing';
import {useAuthStore} from '../../stores';
import {APP_NAME} from '../../utils/constants';

const SOCIAL_BUTTONS = [
  {
    provider: 'google' as const,
    label: 'Google로 시작하기',
    bg: '#FFFFFF',
    textColor: '#333333',
    icon: '\ud83c\udf10',
  },
  {
    provider: 'kakao' as const,
    label: '카카오로 시작하기',
    bg: '#FEE500',
    textColor: '#191919',
    icon: '\ud83d\udcac',
  },
  {
    provider: 'naver' as const,
    label: '네이버로 시작하기',
    bg: '#03C75A',
    textColor: '#FFFFFF',
    icon: 'N',
  },
];

export const LoginScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);

  const handleSocialLogin = (provider: string) => {
    // TODO: 소셜 로그인 구현
    console.log('Social login:', provider);
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigation.replace('MainTabs');
  };

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.bgDark]}
      style={styles.container}>
      <View style={styles.branding}>
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          style={styles.logo}>
          <Text style={styles.logoEmoji}>{'\ud83c\udfb5'}</Text>
        </LinearGradient>
        <Text style={[Typography.h1, styles.title]}>{APP_NAME}</Text>
        <Text style={[Typography.body, styles.subtitle]}>
          AI로 나만의 음악을 만들어보세요
        </Text>
      </View>

      <View style={styles.buttons}>
        {SOCIAL_BUTTONS.map((btn) => (
          <TouchableOpacity
            key={btn.provider}
            onPress={() => handleSocialLogin(btn.provider)}
            activeOpacity={0.8}
            style={[styles.socialBtn, {backgroundColor: btn.bg}]}>
            <Text style={styles.socialIcon}>{btn.icon}</Text>
            <Text style={[Typography.button, {color: btn.textColor}]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleGuestLogin}
        style={styles.guestBtn}
        activeOpacity={0.7}>
        <Text style={[Typography.body, styles.guestText]}>
          로그인 없이 둘러보기
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'center',
  },
  branding: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl + Spacing.xxxl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoEmoji: {
    fontSize: 36,
  },
  title: {
    color: Colors.text1,
  },
  subtitle: {
    color: Colors.text2,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  buttons: {
    gap: Spacing.md,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  socialIcon: {
    fontSize: 18,
  },
  guestBtn: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  guestText: {
    color: Colors.text2,
    textDecorationLine: 'underline',
  },
});
