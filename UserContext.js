import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pickupLocation, setpickupLocation] = useState(null);
  const [loggedUserId, setloggedUserId] = useState(null);

  const [locationCoords, setlocationCoords] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionGranted(false);
        setShowModal(true);
        return;
      }

      setPermissionGranted(true);
      setShowModal(false);

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(location.coords);

      const formatted = `${address[0]?.name}, ${address[0]?.city}`;
      setpickupLocation(formatted);
      setlocationCoords(location.coords); // Use coords only
    } catch (err) {
      console.error('Location error:', err);
    }
  };

  useEffect(() => {
    fetchUserLocation();

    // Refresh location on app focus
    const interval = setInterval(() => {
      fetchUserLocation();
    }, 10000); // update every 10s (you can increase)

    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{
      pickupLocation,
      setpickupLocation,
      locationCoords,
      loggedUserId,
      setloggedUserId,
      setlocationCoords,
      fetchUserLocation
    }}>
      {children}

      {/* Location Permission Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>📍 Location permission is required to continue.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={fetchUserLocation}
            >
              <Text style={styles.buttonText}>Allow Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </UserContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ED2939',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
