import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import useToastStore, { ToastType } from '../stores/toastStore';

const ToastContainer: React.FC = () => {
  const { toast, hideToast } = useToastStore();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast?.isVisible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (toast && !toast.isVisible) {
      // Slide out animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast?.isVisible]);

  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      case 'info':
      default:
        return styles.infoToast;
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (!toast) return null;

  return (
    <SafeAreaView style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.toastWrapper,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={[styles.toast, getToastStyle(toast.type)]}
          onPress={hideToast}
          activeOpacity={0.9}
        >
          <View style={styles.toastContent}>
            <Text style={[styles.toastIcon, getToastStyle(toast.type)]}>
              {getToastIcon(toast.type)}
            </Text>
            <Text style={styles.toastMessage} numberOfLines={3}>
              {toast.message}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toastWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  toast: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  toastMessage: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  successToast: {
    backgroundColor: '#28A745',
  },
  errorToast: {
    backgroundColor: '#DC3545',
  },
  warningToast: {
    backgroundColor: '#FFC107',
  },
  infoToast: {
    backgroundColor: '#17A2B8',
  },
});

export default ToastContainer;