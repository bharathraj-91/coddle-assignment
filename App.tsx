import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useBabyProfileStore from './stores/babyProfileStore';
import useGrowthMeasurementsStore from './stores/growthMeasurementsStore';
import BabyProfileComponent from './components/BabyProfile';
import MeasurementCard from './components/MeasurementCard';
import GrowthChart from './components/GrowthChart';
import { SwipeActions } from './types/measurementCard';
import { GrowthMeasurement } from './types/growthMeasurements';

export default function App() {
  const baby = useBabyProfileStore((state) => state.baby);
  const getAllMeasurements = useGrowthMeasurementsStore((state) => state.getAllMeasurements);
  const deleteMeasurement = useGrowthMeasurementsStore((state) => state.deleteMeasurement);
  
  const allMeasurements = getAllMeasurements();
  
  const handleEdit = (item: GrowthMeasurement) => {
    Alert.alert('Edit Measurement', `Edit functionality not implemented yet for ${item.date}`);
  };

  const handleDelete = (item: GrowthMeasurement) => {
    deleteMeasurement(item.id);
    Alert.alert('Deleted', `Measurement from ${item.date} has been deleted.`);
  };

  const swipeActions: SwipeActions = {
    onEdit: handleEdit,
    onDelete: handleDelete,
  };
  
  const renderHeader = () => (
    <View style={styles.headerContent}>
      {baby && <BabyProfileComponent baby={baby} />}
      {allMeasurements.length > 0 && <GrowthChart measurements={allMeasurements} />}
      <Text style={styles.title}>Growth Measurements ({allMeasurements.length})</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#2C3E50',
  },
});
