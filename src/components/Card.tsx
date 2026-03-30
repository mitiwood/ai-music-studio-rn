import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Colors} from '../theme/colors';
import {Spacing, Radius} from '../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = Spacing.lg,
}) => {
  const cardStyle = [styles.card, {padding}, style];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardDark,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
});
