// BottomSheet.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import ProposalList from "./ProposalList";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.4;

const BottomSheet = ({navigation}) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const [currentState, setCurrentState] = useState('options');
  const [pickup, setPickup] = useState('Your Location');
  const [destination, setDestination] = useState('');
  const [loadAssistance, setLoadAssistance] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [acceptedDrivers, setAcceptedDrivers] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [confirmedDriver, setConfirmedDriver] = useState(null);
  const proposals = [
    { id: 1, name: "Arjun Mehta", photo: "https://i.pravatar.cc/300?img=1", rating: 4.9 },
    { id: 2, name: "Rahul Singh", photo: "https://i.pravatar.cc/300?img=2", rating: 4.7 },
    { id: 3, name: "Amit Kumar", photo: "https://i.pravatar.cc/300?img=3", rating: 4.8 },
  ];
  const scrollTo = useCallback((destination) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const mockDrivers = [
    { id: 1, name: 'Joe Biden', vehicle: 'Tata Ace', rating: 4.94, image: require('../assets/s3.jpg') },
    { id: 2, name: 'Elon Musk', vehicle: 'Mahindra Bolero', rating: 4.87, image: require('../assets/s3.jpg') },
    { id: 3, name: 'Bill Gates', vehicle: 'Ashok Leyland', rating: 4.8, image: require('../assets/s3.jpg') },
  ];

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

  const handleConfirmBooking = () => {
    console.log('selectedOption')

        // console.log(selectedOption)
        navigation.navigate('List', { });
  };

  const handleAcceptDriver = (driver) => {
    setSelectedDriver(driver);
    setCurrentState('confirmed');
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <LinearGradient colors={['#8B4000', '#FFC000']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.line} />

            {/* OPTIONS FORM */}
            {currentState === 'options' && (
              <>
                <Text style={styles.sectionTitle}>Book a Truck</Text>
                <TextInput
                  style={styles.input}
                  value={pickup}
                  onChangeText={setPickup}
                  placeholder="Pickup Location"
                  placeholderTextColor="#aaa"
                />
                <TextInput
                  style={styles.input}
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Destination"
                  placeholderTextColor="#aaa"
                />

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setLoadAssistance(!loadAssistance)}
                >
                  <View style={[
                    styles.checkboxBox,
                    loadAssistance && styles.checkboxBoxChecked
                  ]} />
                  <Text style={styles.checkboxLabel}>Need load/unload assistance</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                  <Text style={styles.datePickerText}>Select Date: {date.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(e, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </>
            )}

            {/* SEARCHING */}
            {currentState === 'searching' && (
              <ProposalList
                proposals={proposals}
                onAccept={(driver) => {
                  setConfirmedDriver(driver);
                  setIsSearching(false); // show confirmed view now
                }}
                onReject={(id) => console.log("Rejected:", id)}
                onBack={() => setIsSearching(false)} // go back to map
              />
            )}


            {/* RESULT */}
            {currentState === 'result' && (
              <>
                <Text style={styles.sectionTitle}>Available Drivers</Text>
                <ScrollView horizontal contentContainerStyle={styles.driverList}>
                  {acceptedDrivers.map((driver) => (
                    <View key={driver.id} style={styles.driverCard}>
                      <Image source={driver.image} style={styles.driverImage} />
                      <Text style={styles.driverName}>{driver.name}</Text>
                      <Text style={styles.driverInfo}>{driver.vehicle}</Text>
                      <Text style={styles.driverInfo}>⭐ {driver.rating}</Text>
                      <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAcceptDriver(driver)}>
                          <Text style={styles.btnText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            {/* CONFIRMED */}
            {currentState === 'confirmed' && selectedDriver && (
              <View style={styles.confirmedCard}>
                <Text style={styles.sectionTitle}>Booking Confirmed</Text>
                <Image source={selectedDriver.image} style={styles.driverImageLarge} />
                <Text style={styles.driverName}>{selectedDriver.name}</Text>
                <Text style={styles.driverInfo}>{selectedDriver.vehicle}</Text>
                <Text style={styles.driverInfo}>ETA: 5 mins</Text>
                <Text style={styles.driverInfo}>Date: {date.toLocaleDateString()}</Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT + 25,
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    elevation: 10,
    overflow: 'hidden',
  },
  gradient: { flex: 1, borderRadius: 25 },
  line: { width: 75, height: 4, backgroundColor: '#ccc', alignSelf: 'center', marginVertical: 15, borderRadius: 25 },
  content: { paddingBottom: 60, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginVertical: 10, textAlign: 'center' },
  input: {
    backgroundColor: '#ffffff20',
    color: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxBoxChecked: {
    backgroundColor: 'white',
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 14,
  },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxLabel: { color: 'white', marginLeft: 8 },
  datePicker: {
    backgroundColor: '#ffffff20',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  datePickerText: { color: 'white' },
  confirmButton: {
    backgroundColor: '#1F2937',
    padding: 15,
    borderRadius: 30,
    alignSelf: 'center',
    width: '60%',
    alignItems: 'center',
  },
  confirmButtonText: { fontWeight: 'bold', color: 'white', fontSize: 16 },
  centeredContent: { justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 100 },
  searchingText: { color: 'white', fontSize: 18, marginTop: 20, textAlign: 'center' },
  driverList: { paddingVertical: 10 },
  driverCard: {
    backgroundColor: '#ffffff20',
    borderRadius: 12,
    padding: 10,
    marginRight: 16,
    alignItems: 'center',
    width: 140,
  },
  driverImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 },
  driverImageLarge: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 },
  driverName: { color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  driverInfo: { color: 'white', fontSize: 14, textAlign: 'center' },
  actionRow: { flexDirection: 'row', marginTop: 10 },
  acceptBtn: {
    backgroundColor: '#1FAD66',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  btnText: { color: 'white', fontWeight: 'bold' },
  confirmedCard: {
    backgroundColor: '#ffffff20',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default BottomSheet;
