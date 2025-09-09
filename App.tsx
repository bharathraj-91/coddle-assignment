import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useBabyProfileStore from './stores/babyProfileStore';
import useGrowthMeasurementsStore from './stores/growthMeasurementsStore';
import BabyProfileComponent from './components/BabyProfile';
import MeasurementCard from './components/MeasurementCard';
import GrowthChart from './components/GrowthChart';
import AddMeasurementModal from './components/AddMeasurementModal';
import { SwipeActions } from './types/measurementCard';
import { GrowthMeasurement } from './types/growthMeasurements';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const baby = useBabyProfileStore((state) => state.baby);
  const getAllMeasurements = useGrowthMeasurementsStore((state) => state.getAllMeasurements);
  const deleteMeasurement = useGrowthMeasurementsStore((state) => state.deleteMeasurement);
  
  const allMeasurements = getAllMeasurements();
  
  const handleEdit = (item: GrowthMeasurement) => {
    Alert.alert('Edit Measurement', `Edit functionality not implemented yet for ${item.date}`);
  };

  const handleDelete = (item: GrowthMeasurement) => {
    Alert.alert(
      'Delete Measurement',
      `Are you sure you want to delete the measurement from ${item.date}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteMeasurement(item.id);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleAddMeasurement = () => {
    setModalVisible(true);
  };

  const swipeActions: SwipeActions = {
    onEdit: handleEdit,
    onDelete: handleDelete,
  };
  
  const renderHeader = () => (
    <View style={styles.headerContent}>
      {baby && <BabyProfileComponent baby={baby} />}
      {allMeasurements.length > 0 && <GrowthChart measurements={allMeasurements} />}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Growth Measurements ({allMeasurements.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMeasurement}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={allMeasurements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MeasurementCard item={item} swipeActions={swipeActions} />}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
        <StatusBar style="auto" />
        <AddMeasurementModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#2C3E50',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
