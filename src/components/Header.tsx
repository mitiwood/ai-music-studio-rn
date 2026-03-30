import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {Spacing} from '../theme/spacing';
import {useAuthStore} from '../stores';
import {APP_NAME} from '../utils/constants';

interface HeaderProps {
  onNotification?: () => void;
  onProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({onNotification, onProfile}) => {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={styles.container}>
      <Text style={[Typography.h2, styles.title]}>{APP_NAME}</Text>
      <View style={styles.right}>
        <TouchableOpacity onPress={onNotification} style={styles.iconBtn}>
          <Text style={styles.icon}>{'\ud83d\udd14'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfile} style={styles.avatarBtn}>
          {user?.avatar ? (
            <Image source={{uri: user.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || '\ud83c\udfb5'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bgDark,
  },
  title: {
    color: Colors.text1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    padding: Spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  avatarBtn: {
    marginLeft: Spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text1,
    fontSize: 14,
    fontWeight: '700',
  },
});
