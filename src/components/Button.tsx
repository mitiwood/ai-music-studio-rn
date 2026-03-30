import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {Spacing, Radius} from '../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.wrapper, style]}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.gradient, isDisabled && styles.disabled]}>
          {loading ? (
            <ActivityIndicator color={Colors.text1} size="small" />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text style={[Typography.button, styles.primaryText]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? Colors.primary : Colors.text2}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              Typography.button,
              variant === 'secondary' && styles.secondaryText,
              variant === 'ghost' && styles.ghostText,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  base: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.transparent,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Spacing.sm,
  },
  primaryText: {
    color: Colors.text1,
  },
  secondaryText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.text2,
  },
});
