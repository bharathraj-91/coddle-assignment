import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import useBabyProfileStore from './stores/babyProfileStore';
import useGrowthMeasurementsStore from './stores/growthMeasurementsStore';
import { GrowthMeasurement } from './types/growthMeasurements';

const MeasurementCard = ({ item }: { item: GrowthMeasurement }) => (
  <View style={styles.measurementCard}>
    <Text>Date: {item.date}</Text>
    <Text>Age: {item.ageInDays} days</Text>
    <Text>Weight: {item.weightInKg} kg ({item.weightPercentile}%)</Text>
    <Text>Height: {item.heightInCm} cm ({item.heightPercentile}%)</Text>
    <Text>Head: {item.headInCm} cm ({item.headPercentile}%)</Text>
  </View>
);

export default function App() {
  const baby = useBabyProfileStore((state) => state.baby);
  const getAllMeasurements = useGrowthMeasurementsStore((state) => state.getAllMeasurements);
  
  const allMeasurements = getAllMeasurements();
  
  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.title}>Baby Profile</Text>
      <Text>Name: {baby?.name}</Text>
      <Text>Gender: {baby?.gender}</Text>
      <Text>Birth Date: {baby?.dateOfBirth.toLocaleDateString()}</Text>
      <Text style={styles.title}>All Measurements ({allMeasurements.length})</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allMeasurements}
        keyExtractor={(item) => item.id}
        renderItem={MeasurementCard}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  measurementCard: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
