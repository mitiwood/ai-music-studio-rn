import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {Spacing, Radius} from '../theme/spacing';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

const toastColors: Record<ToastType, string> = {
  success: Colors.success,
  error: Colors.error,
  info: Colors.primary,
  warning: Colors.warning,
};

const toastIcons: Record<ToastType, string> = {
  success: '\u2705',
  error: '\u274c',
  info: '\u2139\ufe0f',
  warning: '\u26a0\ufe0f',
};

let _showToast: (message: string, type?: ToastType) => void = () => {};

export const showToast = (message: string, type: ToastType = 'info') => {
  _showToast(message, type);
};

const ToastItem: React.FC<{toast: ToastMessage; onDone: (id: number) => void}> = ({
  toast,
  onDone,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onDone(toast.id));
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          borderLeftColor: toastColors[toast.type],
          transform: [{translateY: slideAnim}],
          opacity: opacityAnim,
        },
      ]}>
      <Text style={styles.toastIcon}>{toastIcons[toast.type]}</Text>
      <Text style={styles.toastText}>{toast.text}</Text>
    </Animated.View>
  );
};

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idCounter = useRef(0);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, {id, text: message, type}]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    _showToast = show;
    return () => {
      _showToast = () => {};
    };
  }, [show]);

  return (
    <>
      {children}
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDone={remove} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 9999,
  },
  toastIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  toastText: {
    ...Typography.body,
    color: Colors.text1,
    flex: 1,
  },
});
