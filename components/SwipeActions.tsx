import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface SwipeActionsProps {
  translateX: Animated.SharedValue<number>;
  onEdit: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 100;

const SwipeActions: React.FC<SwipeActionsProps> = ({ translateX, onEdit, onDelete }) => {
  const actionsStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, Math.min(1, -translateX.value / SWIPE_THRESHOLD)),
  }));

  return (
    <Animated.View style={[styles.actionsContainer, actionsStyle]}>
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Text style={styles.editButtonText}>✏️ Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 160,
    flexDirection: 'row',
    borderRadius: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498DB',
    textAlign: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E74C3C',
    textAlign: 'center',
  },
});

export default SwipeActions;