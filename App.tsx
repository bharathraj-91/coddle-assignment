import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import useBabyProfileStore from './stores/babyProfileStore';
import useGrowthMeasurementsStore from './stores/growthMeasurementsStore';
import { GrowthMeasurement } from './types/growthMeasurements';
import BabyProfileComponent from './components/BabyProfile';

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
      {baby && <BabyProfileComponent baby={baby} />}
      <Text style={styles.title}>Growth Measurements ({allMeasurements.length})</Text>
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
  measurementCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
