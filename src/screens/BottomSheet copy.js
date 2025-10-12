import React, { useEffect, useState, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.4;

const BottomSheet = () => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const [currentState, setCurrentState] = useState('options'); // options → searching → result → callback
  const [selectedOption, setSelectedOption] = useState('');
  const [acceptedDrivers, setAcceptedDrivers] = useState([]);

  const scrollTo = useCallback((destination) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const mockPrices = { mini: 50, auto: 60, sedan: 100, bike: 30, premium: 150 };
  const mockDrivers = [
    { id: 1, name: 'Joe Biden', vehicle: 'Honda City', rating: 4.94, image: require('../assets/s3.jpg') },
    { id: 2, name: 'Elon Musk', vehicle: 'Tesla Model 3', rating: 4.87, image: require('../assets/s3.jpg') },
    { id: 3, name: 'Bill Gates', vehicle: 'Toyota Corolla', rating: 4.8, image: require('../assets/s3.jpg') },
    { id: 4, name: 'Mark Zuckerberg', vehicle: 'Honda Civic', rating: 4.9, image: require('../assets/s3.jpg') },
  ];

  // Gesture
  const gesture = Gesture.Pan()
    .onStart(() => { context.value = { y: translateY.value }; })
    .onUpdate((event) => { translateY.value = Math.max(event.translationY + context.value.y, MAX_TRANSLATE_Y); })
    .onEnd(() => {
      if (translateY.value > MIN_TRANSLATE_Y) scrollTo(MIN_TRANSLATE_Y);
      else if (translateY.value < MAX_TRANSLATE_Y) scrollTo(MAX_TRANSLATE_Y);
    });

  useEffect(() => {
    scrollTo(MIN_TRANSLATE_Y);
  }, []);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(translateY.value, [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y], [25, 5], Extrapolation.CLAMP);
    return { borderRadius, transform: [{ translateY: translateY.value }] };
  });

  const handleRequest = () => {
    setCurrentState('searching');
    setTimeout(() => {
      setAcceptedDrivers(mockDrivers);
      setCurrentState('result');
    }, 5000);
    setTimeout(() => {
      setCurrentState('callback');
    }, 2 * 60 * 1000);
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <LinearGradient colors={['#8B4000', '#FFC000']} style={styles.gradient}>
          <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <View style={styles.line} />

            {/* OPTIONS */}
            {currentState === 'options' && (
              <>
                <Text style={styles.sectionTitle}>Select Vehicle</Text>
                <FlatList
                  data={[
                    { type: 'mini', name: 'Rickshaw', eta: '4 mins', image: require('../assets/Rickshaw.png'), description: 'Affordable ride for short city trips' },
                    { type: 'auto', name: 'Toto', eta: '5 mins', image: require('../assets/toto.png'), description: 'Eco-friendly electric three-wheeler' },
                    { type: 'sedan', name: 'Auto', eta: '3 mins', image: require('../assets/auto.png'), description: 'Quick and cost-effective' },
                    { type: 'bike', name: 'Bike', eta: '2 mins', image: require('../assets/bike.png'), description: 'Fastest ride for solo travellers' },
                    { type: 'premium', name: 'Car', eta: '6 mins', image: require('../assets/auto.png'), description: 'Comfortable option for group rides' },
                  ]}
                  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                  keyExtractor={(item) => item.type}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.vehicleRow, selectedOption === item.type && styles.selectedVehicleRow]} onPress={() => { setSelectedOption(item.type); handleRequest(); }}>
                      <View style={styles.vehicleImageSection}>
                        <Image source={item.image} style={styles.vehicleImage} />
                        <Text style={styles.etaText}>{item.eta}</Text>
                      </View>
                      <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleName}>{item.name}</Text>
                        <Text style={styles.vehicleDescription}>{item.description}</Text>
                        <Text style={styles.priceText}>₹ {mockPrices[item.type]}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
                <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
                  <Text style={styles.requestButtonText}>Request</Text>
                </TouchableOpacity>
              </>
            )}

            {/* SEARCHING */}
            {currentState === 'searching' && (
              <View style={styles.centeredContent}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.searchingText}>Sending your request...</Text>
              </View>
            )}

            {/* RESULT */}
            {currentState === 'result' && (
              <View style={{ paddingVertical: 20 }}>
                <Text style={styles.confirmationText}>Drivers accepted your request:</Text>
                <FlatList
                  data={acceptedDrivers}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  renderItem={({ item }) => (
                    <View style={styles.driverCard}>
                      <Image source={item.image} style={styles.driverImage} />
                      <Text style={styles.driverName}>{item.name}</Text>
                      <Text style={styles.driverRating}>{item.rating}⭐</Text>
                    </View>
                  )}
                />
              </View>
            )}

            {/* CALLBACK */}
            {currentState === 'callback' && (
              <View style={styles.centeredContent}>
                <Text style={styles.searchingText}>You will get a call back from us shortly.</Text>
              </View>
            )}
          </KeyboardAvoidingView>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: { height: SCREEN_HEIGHT+25, width: '100%', position: 'absolute', top: SCREEN_HEIGHT, borderRadius: 25, elevation: 10, overflow: 'hidden' },
  gradient: { flex: 1, borderRadius: 25 },
  line: { width: 75, height: 4, backgroundColor: '#ccc', alignSelf: 'center', marginVertical: 15, borderRadius: 25 },
  content: { flex: 1, padding: 0 },
  requestButton: { backgroundColor: '#1F2937', padding: 15, borderRadius: 30, bottom: 120, alignSelf: 'center', width: '60%', alignItems: 'center' },
  requestButtonText: { fontWeight: 'bold', color: 'white', fontSize: 16 },
  searchingText: { color: 'white', fontSize: 18, marginTop: 20, textAlign: 'center' },
  centeredContent: { justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 8, color: 'white' },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12, marginBottom: 12 },
  selectedVehicleRow: { backgroundColor: '#333', borderColor: '#ED2939' },
  vehicleImageSection: { alignItems: 'center', marginRight: 15, width: 60 },
  vehicleImage: { width: 50, height: 50, resizeMode: 'contain' },
  etaText: { fontSize: 12, color: 'white', marginTop: 4 },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: 16, fontWeight: '600', color: 'white' },
  vehicleDescription: { fontSize: 14, color: 'white', marginTop: 5 },
  priceText: { fontWeight: 'bold', color: 'white', fontSize: 16, marginTop: 5 },
  confirmationText: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 15, textAlign: 'center' },
  driverCard: { width: 100, alignItems: 'center', marginRight: 15 },
  driverImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 5 },
  driverName: { color: 'white', fontWeight: '600', textAlign: 'center' },
  driverRating: { color: 'white', textAlign: 'center' },
});

export default BottomSheet;
