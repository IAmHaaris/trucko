import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const windowHeight = Dimensions.get('window').height;

const gridData = [
  { id: '1', name: 'Alice Smith', rightImage: require('./../assets/driver.jpg') },
  { id: '2', name: 'Bob Johnson', rightImage: require('./../assets/driver.jpg') },
  { id: '3', name: 'Emily Brown', rightImage: require('./../assets/driver.jpg') },
  { id: '4', name: 'David Wilson', rightImage: require('./../assets/driver.jpg') },
];

const GridItem = ({ name, rightImage, onAccept }) => {
  return (
<LinearGradient colors={['#8B4000', '#FFC000']} style={styles.gridItem}>
      <View ><Text style={styles.name}>{name}</Text></View>
      <View ><Text style={styles.name1}>Exp-5years</Text></View>
      <View ><Text style={styles.name2}>Ratings: 4.3</Text></View>
      <View ><Text style={styles.description}>{name} is expertised in driving {'\n'} suvs and xuvs also </Text></View>
      <View style={styles.border}></View>
      <View ><Text style={styles.price}>Price Offered $80</Text></View>
      <TouchableOpacity style={styles.loginBtn} onPress={onAccept}>
        <Text style={styles.loginText}>Accept</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image source={rightImage} style={styles.gridImage} />
      </View>
    </LinearGradient>
  );
};

const MyComponent = (route) => {
  console.log('route');
  console.log(route.route.params);

  const { selectedOptions } = route.route.params;  // Access selectedOption from route.params

  console.log('Selected Option:', selectedOptions);
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const [bookingConfirmed, setBookingConfirmed] = useState(true);
  // const setBookingConfirmed = true; // State to control the display of input fields
  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length < gridData.length) {
        const newItem = gridData[items.length];
        setItems(prevItems => [...prevItems, newItem]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [items]);

  const handleAccept = () => {
    navigation.navigate('Map', { bookingConfirmed:true, selectedOptions:selectedOptions });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {items.map(item => (
        <GridItem
          key={item.id}
          name={item.name}
          rightImage={item.rightImage}
          onAccept={handleAccept}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#8B4000',
    padding: 10
  },
  gridItem: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  description: {
    position: 'absolute',
    marginLeft: 30,
    marginTop: -40,
  },
  name: {
    color: 'black',
    position: 'absolute',
    fontSize: 20,
    marginLeft: 30,
    marginTop: -110,
    zIndex: 1,
  },
  loginBtn: {
    backgroundColor: '#000000',
    width: '60%',
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 150,
    height: 50,
    justifyContent: 'center',
  },
  loginText: {
    color: '#ffffff',
    justifyContent: 'center',
  },
  price: {
    marginTop: 10,
    position: 'absolute',
    fontSize: 20,
    marginLeft: 30,
    color: 'green',
  },
  name1: {
    color: 'black',
    position: 'absolute',
    marginLeft: 30,
    marginTop: -80,
  },
  name2: {
    color: 'black',
    position: 'absolute',
    marginTop: -60,
    marginLeft: 30,
  },
  border: {
    position: 'absolute',
    top: 130,
    left: 30,
    width: '65%',
    borderBottomColor: 'green',
    borderBottomWidth: 2,
  },
  imageContainer: {
    width: '25%',
    height: '40%',
    borderRadius: 60,
    overflow: 'hidden',
    marginTop: -110,
    marginLeft: 'auto',
  },
  gridImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default MyComponent;
