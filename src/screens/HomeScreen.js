import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const gridData = [
    { id: '1', rightImage: require('./../assets/side1.jpg') },
    { id: '5', rightImage: require('./../assets/s4.jpg') },
    { id: '2', rightImage: require('./../assets/s5.jpg') },
    { id: '3', rightImage: require('./../assets/s6.jpg') },
    { id: '4', rightImage: require('./../assets/s7.jpg') },
];

const GridItem = ({ rightImage, navih }) => {
    return (
        <TouchableOpacity onPress={() => navih.navigate("MapScreen", {
            bookingDetails: {  },
        })} style={styles.gridItem}>
            <Image source={rightImage} style={styles.gridImage} />
        </TouchableOpacity>
    );
};

const Test = ({ navigation, route }) => {
    // console.log(route.params.userName)
    // const namevalue = route.params.userName;
    const [modalVisible, setModalVisible] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        if (route.params?.bookingConfirmed) {
            setBookingDetails(route.params.bookingDetails);
            // setModalVisible(true);
        }
    }, [route.params?.bookingConfirmed]);

    return (
<LinearGradient colors={['#8B4000', '#FFC000']} style={styles.container}>
            {/* User Info Section */}
            <View style={styles.userInfo}>
                <Text style={styles.greeting}>Hi Haaris,</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Account')}
                >
                    <Image source={require('./../assets/driver.jpg')} style={styles.userImage} />
                </TouchableOpacity>
            </View>

            {/* Booking Question */}
            <Text style={styles.bookingQuestion}>Which Heavy duty you want to book today?</Text>

            {/* Scrollable Grid */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {gridData.map(item => (
                    <GridItem
                        key={item.id}
                        navih={navigation}
                        rightImage={item.rightImage}
                    />
                ))}
            </ScrollView>

            {/* Booking Confirmation Modal */}
            {modalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Booking Confirmed</Text>
                            <Text style={styles.modalText}>Driver: {bookingDetails?.driverName}</Text>
                            <Text style={styles.modalText}>Vehicle: {bookingDetails?.vehicleModel}</Text>
                            <Text style={styles.modalText}>Time: {bookingDetails?.time}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ED2939',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
    },
    bookingQuestion: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    gridItem: {
        alignItems: 'center',
        marginBottom: 20,
    },
    gridImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#ED2939',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Test;
