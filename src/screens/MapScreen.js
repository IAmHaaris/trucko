import React, { useEffect, useState, useContext, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import BottomSheet from './BottomSheet';
import * as Location from 'expo-location';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../UserContext';
import MapViewDirections from 'react-native-maps-directions';

const GoogleMapComponent = ({ navigation, startLiveMovement, route, bookingConfirmed, onConfirmBooking }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [connected, setConnected] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [initialRegion, setInitialRegion] = useState(null);
  const [driversRegion, setDriversRegion] = useState(null);
  const { pickupLocation } = useContext(UserContext);
  const { locationCoords } = useContext(UserContext);
  const mapRef = useRef(null);
  const [dropCoords, setDropCoords] = useState(null);

  const [bottomSheetState, setBottomSheetState] = useState('options');
  const dummySuggestions = [
    'Railway Station',
    'City Mall',
    'Airport Terminal 3',
    'Main Bazaar',
  ];
  const handleSelectSuggestion = (location) => {
    setDropLocation(location);
    setShowSuggestions(false);
  };
  const [showSuggestions, setShowSuggestions] = useState(false);

  let locationArr = [];
  const [errorMsg, setErrorMsg] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [priceArayy, setPriceArray] = useState(null);
  const vehicleRates = {
    bike: 10,         // ₹10/km
    auto: 15,
    mini: 20,
    sedan: 25,
    suv: 30,
    premium: 40,
  };

  function calculatePrices(distanceKm) {
    const prices = {};
    Object.entries(vehicleRates).forEach(([vehicle, rate]) => {
      prices[vehicle] = Math.round(rate * distanceKm);
    });
    return prices;
  }

  const selectedOptions = route.params?.selectedOptions;
  const dropLocation = route.params?.selectedDrop;
  const locationCoordinates = route.params?.locationCoordinates;

  useEffect(() => {
    (async () => {

      console.log('pickuplocation', pickupLocation)
      if (pickupLocation) {
        const geo = await Location.geocodeAsync(pickupLocation);
        console.log('geo', geo)

        setPickupCoords({
          latitude: geo[0].latitude,
          longitude: geo[0].longitude,
        });
      }
      // Dummy drop - later replace with actual user input
      const drop = await Location.geocodeAsync(dropLocation);
      console.log('drop', drop)
      setDropCoords({
        latitude: drop[0].latitude,
        longitude: drop[0].longitude,
      });
    })();

  }, [pickupLocation]);
  console.log('d cords', dropCoords);
  console.log('l co', locationCoords);
  useEffect(() => {
    if (startLiveMovement && currentLocation) {
      const interval = setInterval(() => {
        setCurrentLocation(prevLocation => ({
          ...prevLocation,
          latitude: prevLocation.latitude + 0.0001,
          longitude: prevLocation.longitude + 0.0001,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startLiveMovement, currentLocation]);
  useEffect(() => {
    if (bottomSheetState === 'result') {
      console.log('🎯 Driver found. Trigger map changes here.');
      // maybe zoom to driver location or update UI
    }
  }, [bottomSheetState]);
  useEffect(() => {
    const userSocket = new WebSocket('ws://192.168.100.103:8080?role=user&id=USER_ID');
    console.log('connected to soket in map component');
    userSocket.onopen = () => {
      console.log('Connected to WebSocket in googlemapComponent');
      userSocket.send(JSON.stringify({ type: 'user' }));
      console.log('sent data ', JSON.stringify({ type: 'user' }))
    };
    // userSocket.send(JSON.stringify({ type: 'user' }));

    userSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data)
      // console.log('data coming in map component')
      if (data.type === 'location') {
        // console.log('Received driver location:', data.location);
        if (data.location.length > 0 && data.location.length !== 0) {

          for (let i = 0; i < data.location.length; i++) {
            // console.log('Received driver location:', data.location[i]);
            locationArr.push(data.location[i].location);

          }
        }
        if (data.location.length === 0) {
          // console.log('array should be empty');
          // console.log(data.location)
        }

        // Ensure data.location is properly structured
        if (locationArr.length) {
          locationArr = locationArr.filter((location, index, self) =>
            index === self.findIndex((loc) => loc.lat === location.lat)
          );


          // locationArr = locationArr.filter(item => item.email !== item.email);
          // console.log(locationArr);

          setDriversRegion({ "latitude": locationArr[0].lat, "longitude": locationArr[0].lng });
          // setDriversRegion({ "latitude": 22.679288531674704, "longitude": 88.36991622120921 });

        } else {
          // console.log('Received location data is invalid:', locationArr);
          setDriversRegion({ "latitude": 22.679288531674704, "longitude": 88.36991622120921 });
        }
      } else {
        console.log('Received unknown message type:', data.type);

      }
    };

    return () => {
      userSocket.close();
    };
  }, []);
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2); // return in km
  }
  if (locationCoords && dropCoords) {
    

  }
  useEffect(() => {
    if (locationCoords && dropCoords) {
      try {
        console.log('@@@@@')
        let distanceKm;
        if(locationCoords.cords) {
           distanceKm = calculateDistance(
            locationCoords.coords.latitude,
            locationCoords.coords.longitude,
            dropCoords.latitude,
            dropCoords.longitude
          );
        } else {
          distanceKm = calculateDistance(
            locationCoords.latitude,
            locationCoords.longitude,
            dropCoords.latitude,
            dropCoords.longitude
          )
        }
        
        console.log(distanceKm)
        if (distanceKm) {
          const prices = calculatePrices(distanceKm)
  
          console.log(prices)
          setPriceArray(prices)
        }
      } catch (err) {
        console.log('err im distance cal', err);
      }

    }
  }, [locationCoords]);

  useEffect(() => {
    if (locationCoords) {
      try {
        if(locationCoords.coords) {
          setInitialRegion({
            latitude: locationCoords.coords.latitude,
            longitude: locationCoords.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } else {
          setInitialRegion({
            latitude: locationCoords.latitude,
            longitude: locationCoords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
       
      } catch (err) {
        console.log('errrr', err)

      }

    }
  }, [locationCoordinates]);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={styles.container}>
          <View style={styles.mapContainer}>
            {!bookingConfirmed && initialRegion ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                mapType="standard"
                region={
                  currentLocation
                    ? {
                      ...currentLocation,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
                    : initialRegion
                }
              >
                {bottomSheetState !== 'result' && dropCoords && pickupCoords && (
                  <>
                    {/* Show current marker */}
                    {/* <Marker
                      coordinate={currentLocation || initialRegion}
                      title="Current Location"
                      description="This is your current location"
                    >
                      <Image source={require('../assets/i.png')} style={{ width: 35, height: 40 }} />
                    </Marker> */}
                    <Marker coordinate={dropCoords}>
                      <Image source={require('../assets/auto.png')} style={{ width: 35, height: 30 }} />
                    </Marker>

                    {/* Drop Marker */}
                    <Marker coordinate={pickupCoords}>
                      <Image source={require('../assets/i.png')} style={{ width: 40, height: 30 }} />
                    </Marker>
                    <MapViewDirections
                      origin={pickupCoords}
                      destination={dropCoords}
                      apikey='AIzaSyASv9_UTdVuGeqVBokorL3IhL03sAEKi_M'
                      strokeWidth={4}
                      strokeColor="#007AFF"
                      lineDashPattern={[5, 5]} // ← dotted line
                      mode="DRIVING"
                      onReady={(result) => {
                        mapRef.current?.fitToCoordinates(result.coordinates, {
                          edgePadding: { top: 80, right: 50, bottom: 80, left: 50 },
                          animated: true,
                        });
                      }}
                    />
                  </>
                )}

                {/* 🚀 Show polyline when bottomSheetState === 'result' */}
                {bottomSheetState === 'result' && (
                  <>
                    <Marker coordinate={{ latitude: 22.6845, longitude: 88.3733 }}>
                      <Image source={require('../assets/auto.png')} style={{ width: 35, height: 40 }} />
                    </Marker>
                    <Marker coordinate={{ latitude: 22.6602, longitude: 88.3773 }}>
                      <Image source={require('../assets/i.png')} style={{ width: 40, height: 30 }} />
                    </Marker>
                    <Polyline
                      coordinates={[
                        { latitude: 22.6845, longitude: 88.3733 },
                        { latitude: 22.6602, longitude: 88.3773 },
                      ]}
                      strokeColor="#007AFF"
                      strokeWidth={4}
                    />
                  </>
                )}
              </MapView>
            ) : bookingConfirmed ? (
              <View style={styles.container}>
                <MapView
                  style={styles.map}
                  mapType="standard"
                  initialRegion={{
                    latitude: 37.7749,
                    longitude: -122.4194,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={coordinates}
                    title={"Car"}
                    description={"This is a car icon"}
                    pinColor={"red"} // Use pin color initially to verify movement
                  >
                    <Image source={require('../assets/nav.png')} style={{ width: 40, height: 40 }} />
                  </Marker>
                </MapView>
                {!connected && (
                  <View style={styles.overlay}>
                    <Text style={styles.text}>Connecting to WebSocket...</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.errorMsg}>{errorMsg}</Text>
            )}
          </View>

          {/* Conditionally render Back Button */}
          {!bookingConfirmed && bottomSheetState !== 'result' && (
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Where from?"
                value={pickupLocation}
              // editable={false}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Where to?"
                value={dropLocation}
                onChangeText={(text) => {
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />

              {showSuggestions && (
                <View style={{ backgroundColor: '#fff', borderRadius: 8, marginTop: 4 }}>
                  {dummySuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectSuggestion(item)}
                      style={{ padding: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            </View>
          )}
          <BottomSheet navigation={navigation} requestType={selectedOptions} priceArayy = {priceArayy} bottomSheetState={bottomSheetState} dropLocation={dropLocation}
            // 👈 Pass it here

            setBottomSheetState={setBottomSheetState} />
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 20,
  },
  searchBox: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    width: '90%',
    // backgroundColor: '#10B981',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  errorMsg: {
    color: 'red',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    color: 'white',
  },
});

export default GoogleMapComponent;
