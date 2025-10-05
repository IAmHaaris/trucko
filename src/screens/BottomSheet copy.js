import React, { useEffect, useCallback, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    FlatList
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.4;

const BottomSheet = ({ navigation, isConfirmed, requestType, dropLocation, onConfirmBooking, bottomSheetState, setBottomSheetState, priceArayy }) => {
    console.log('btmsheer', priceArayy)
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });
    const [selectedOption, setSelectedOption] = useState('');
    const [showInputs, setShowInputs] = useState(false);
    const currentState = bottomSheetState;
    const setCurrentState = setBottomSheetState;
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);

    const scrollTo = useCallback((destination) => {
        'worklet';
        translateY.value = withSpring(destination, { damping: 50 });
    }, [translateY]);
    const canRequest = dropLocation && dropLocation.trim() !== '' && selectedOption;
    const [modalVisible, setModalVisible] = useState(false);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > MIN_TRANSLATE_Y) {
                scrollTo(MIN_TRANSLATE_Y);
            } else if (translateY.value < MAX_TRANSLATE_Y) {
                scrollTo(MAX_TRANSLATE_Y);
            }
        });
    useEffect(() => {
        if (priceArayy && Object.keys(priceArayy).length > 0) {
            setIsLoadingPrices(false);
        }
    }, [priceArayy]);

    useEffect(() => {
        scrollTo(MIN_TRANSLATE_Y);
    }, []);

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translateY.value,
            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
            [25, 5],
            Extrapolation.CLAMP
        );
        return {
            borderRadius,
            transform: [{ translateY: translateY.value }],
        };
    });
    useEffect(() => {
        const defaultOption = 'auto'; // or your first vehicle type
        setSelectedOption(defaultOption);
    }, []);
    const handleOptionSelect = (option) => {
        // setSelectedOption(option);
        // setShowInputs(true);
        // if (canRequest) {
        handleRequest();
        // }
    };
    useEffect(() => {
        // If priceArayy is empty, use mock prices
        if (!priceArayy || Object.keys(priceArayy).length === 0) {
            const mockPrices = {
                mini: 50,
                auto: 60,
                sedan: 100,
                bike: 30,
                premium: 150,
            };
            setIsLoadingPrices(false);
            // Optional: setPriceArray(mockPrices) if you want it displayed in vehicle rows
            priceArayy = mockPrices;
        } else {
            setIsLoadingPrices(false);
        }
    }, []);
    const handleCall = () => Linking.openURL('tel:9876543210');
    const handleCancel = () => {
        // Reset everything to initial state
        setSelectedOption('');
        setShowInputs(false);
        setCurrentState('options');
    };
    const handleRequest = () => {
        setCurrentState('searching');
        setTimeout(() => {
            setCurrentState('result');
        }, 5000);
    };


    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                <KeyboardAvoidingView
                    style={styles.content}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View style={styles.line} />
                    {currentState === 'options' && (
                        <>

                            {priceArayy && Object.keys(priceArayy).length > 0 ? (

                                <>
                                    <Text style={styles.sectionTitle}>Select Vehicle</Text>


                                    <FlatList
                                        data={[
                                            {
                                                type: 'mini',
                                                name: 'Rickshaw',
                                                eta: '4 mins',
                                                image: require('../assets/Rickshaw.png'),
                                                description: 'Affordable ride for short city trips',
                                            },
                                            {
                                                type: 'auto',
                                                name: 'Toto',
                                                eta: '5 mins',
                                                image: require('../assets/toto.png'),
                                                description: 'Eco-friendly electric three-wheeler',
                                            },
                                            {
                                                type: 'sedan',
                                                name: 'Auto',
                                                eta: '3 mins',
                                                image: require('../assets/auto.png'),
                                                description: 'Quick and cost-effective for daily travel',
                                            },
                                            {
                                                type: 'bike',
                                                name: 'Bike',
                                                eta: '2 mins',
                                                image: require('../assets/bike.png'),
                                                description: 'Fastest ride for solo travellers',
                                            },
                                            {
                                                type: 'premium',
                                                name: 'Car',
                                                eta: '6 mins',
                                                image: require('../assets/auto.png'),
                                                description: 'Comfortable option for group rides',
                                            },
                                        ]}
                                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                                        style={{ backgroundColor: 'transparent' }}
                                        keyExtractor={(item) => item.type}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[
                                                    styles.vehicleRow,
                                                    selectedOption === item.type && styles.selectedVehicleRow,
                                                ]}
                                                onPress={() => handleRequest()}
                                            >
                                                <View style={styles.vehicleImageSection}>
                                                    <Image source={item.image} style={styles.vehicleImage} />
                                                    <Text style={styles.etaText}>{item.eta}</Text>
                                                </View>
                                                <View style={styles.vehicleInfo}>
                                                    <Text style={styles.vehicleName}>{item.name}</Text>
                                                    <Text style={styles.vehicleDescription}>{item.description}</Text>

                                                    {/* 💰 Show price if available for that type */}
                                                    {priceArayy?.[item.type] != null && (
                                                        <Text style={styles.priceText}>₹ {priceArayy[item.type]}</Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        showsVerticalScrollIndicator={false}
                                    />

                                    <TouchableOpacity
                                        style={styles.requestButton}
                                        onPress={handleRequest}
                                        disabled={!selectedOption}
                                    >
                                        <Text style={styles.requestButtonText}>Request</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={{ alignItems: 'center', padding: 20 }}>
                                    <ActivityIndicator size="large" color="white" />
                                    <Text style={{ marginTop: 10, color: 'white' }}>Fetching ride fares...</Text>
                                </View>
                            )}
                        </>
                    )}


                    {currentState === 'searching' && (
                        <View style={styles.centeredContent}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.searchingText}>Searching for nearby vehicles...</Text>
                        </View>
                    )}

                    {currentState === 'result' && (
                        <ScrollView>
                            <Text style={styles.confirmationText}>Pick-up in 5 minutes</Text>
                            <View style={styles.tripDetailsBox}>
                                <View style={styles.tripDetailsHeader}>
                                    <Text style={styles.tripDetailsText}>Trip details</Text>
                                    <TouchableOpacity style={styles.moreDetailsButton} onPress={() => setModalVisible(true)}>
                                        <Text style={styles.moreDetailsButtonText}>...</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.meetText}>Meet at pick-up point</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.pinContainer}>
                                <Text style={styles.pinText}>Pin for the ride</Text>
                                <View style={styles.pinNumbers}>
                                    <View style={styles.pinBox}><Text style={styles.pinNumber}>1</Text></View>
                                    <View style={styles.pinBox}><Text style={styles.pinNumber}>2</Text></View>
                                    <View style={styles.pinBox}><Text style={styles.pinNumber}>3</Text></View>
                                    <View style={styles.pinBox}><Text style={styles.pinNumber}>4</Text></View>
                                </View>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoContainer}>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.vehicleCode}>WB24A5TY</Text>
                                    <Text style={styles.vehicleModel}>Honda City</Text>
                                    <Text style={styles.name}>Joe Biden . 4.94*. Knows English, Hindi</Text>
                                </View>
                                <Image source={require('../assets/s3.jpg')} style={styles.smallImage} />
                            </View>
                        </ScrollView>
                    )}
                </KeyboardAvoidingView>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        backgroundColor: '#10B981',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderRadius: 25,
        elevation: 10,
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 25,
    },
    content: {
        flex: 1,
        padding: 0,
    },
    requestButton: {
        backgroundColor: '#1F2937',
        padding: 15,
        borderRadius: 30,
        marginTop: 20,
        alignSelf: 'center',
        width: '60%',
        alignItems: 'center',
    },
    requestButtonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
    },
    searchingText: {
        color: 'white',
        fontSize: 18,
        marginTop: 20,
    },
    centeredContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    driverName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginTop: 5,
    },

    driverDetails: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    confirmationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 0,
        textAlign: 'center',
    },
    tripDetailsBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 25,
        padding: 15,
        marginBottom: 15,
    },
    tripDetailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    tripDetailsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    meetText: {
        fontSize: 14,
        color: 'white',
    },
    moreDetailsButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    driverRating: {
        fontSize: 14,
        color: '#f1c40f',
        marginTop: 5,
    },
    moreDetailsButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    separator: {
        height: 1,
        backgroundColor: 'white',
        marginVertical: 10,
    },
    pinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    pinText: {
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
    },
    pinNumbers: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pinBox: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 7,
        marginLeft: 5,
        alignItems: 'center',
        height: 35,
    },
    pinNumber: {
        fontSize: 18,
        color: '#ED2939',
    },
    infoContainer: {
        flexDirection: 'row',
        padding: 10
        // alignItems: 'center',
        // justifyContent: 'space-between',
        // marginBottom: 10,
    },
    fareText: {
        marginTop: 6,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ED2939',
    }
    ,
    smallImage: {
        width: 40,
        height: 40,
        marginLeft: 10,
        borderRadius: 20,
    },
    infoTextContainer: {
        flex: 1,
    },
    driverCode: {
        fontSize: 20,
        color: 'white',
    },
    vehicleModel: {
        fontSize: 14,
        color: 'white',
    },
    name: {
        fontSize: 14,
        color: 'white',
    },
    priceText: {
        bottom: 30,
        fontWeight: 'bold',
        color: 'white', // green
        fontSize: 16,
        left: 220
    },

    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937', // Soft red
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    container: {
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 10,
    },
    driverRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftColumn: {
        width: '45%',
    },
    rightColumn: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f1f1f1',
        marginBottom: 6,
    },
    vehicleImage: {
        width: 80,
        height: 60,
        resizeMode: 'contain',
    },
    otp: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    driverName: {
        fontSize: 16,
        color: '#f1f1f1',
        marginTop: 6,
    },
    rating: {
        fontSize: 16,
        color: '#f1f1f1',
        marginTop: 4,
    },
    vehicleDescription: {
        fontSize: 14,
        top: 35,
        color: 'white',
        textAlign: 'right',

    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    vehicleCode: {
        fontSize: 16,
        color: 'white',
    },
    driverCode: {
        fontSize: 20,
        color: 'white',
    },
    callText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ED2939', // Soft red
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    cancelText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    fare: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 8,
        marginHorizontal: 16,
        color: 'white',
    },
    vehicleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 12,
        shadowOpacity: 0.1,
    },

    selectedVehicleRow: {
        backgroundColor: '#333', // Deep red for strong contrast
        borderColor: '#ED2939',
    },

    etaText: {
        fontSize: 12,
        color: 'white',
        marginTop: 4,
    },

    vehicleName: {
        fontSize: 16,
        fontWeight: '600',
        position: 'absolute',
        left: '0',
        color: 'white',
        bottom: 30
    },


    vehicleImageSection: {
        alignItems: 'center',
        marginRight: 15,
        width: 60,
    },

    vehicleImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },




});

export default BottomSheet;
