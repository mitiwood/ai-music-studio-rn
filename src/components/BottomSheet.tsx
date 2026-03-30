import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {Spacing, Radius} from '../theme/spacing';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  height = SCREEN_HEIGHT * 0.5,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          slideAnim.setValue(g.dy);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > height * 0.3 || g.vy > 0.5) {
          close();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const open = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(height);
      open();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={close}>
        <Animated.View
          style={[styles.backdropBg, {opacity: backdropAnim}]}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.sheet,
          {height, transform: [{translateY: slideAnim}]},
        ]}
        {...panResponder.panHandlers}>
        <View style={styles.handle} />
        {title && <Text style={[Typography.h3, styles.title]}>{title}</Text>}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.cardDark,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDark,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.text1,
    marginBottom: Spacing.lg,
  },
  content: {
    flex: 1,
  },
});
