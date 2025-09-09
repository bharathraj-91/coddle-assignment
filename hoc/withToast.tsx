import React from 'react';
import { View, StyleSheet } from 'react-native';
import ToastContainer from '../components/ToastContainer';
import useToastStore, { ToastType } from '../stores/toastStore';

export interface WithToastProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

function withToast<P extends object>(
  WrappedComponent: React.ComponentType<P & WithToastProps>
): React.FC<P> {
  const ToastHOC: React.FC<P> = (props) => {
    const { showToast, hideToast } = useToastStore();

    return (
      <View style={styles.container}>
        <WrappedComponent
          {...props}
          showToast={showToast}
          hideToast={hideToast}
        />
        <ToastContainer />
      </View>
    );
  };

  ToastHOC.displayName = `withToast(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ToastHOC;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withToast;