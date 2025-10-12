import React, { useState } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const services = [
    { id: "1", name: "Truck", image: require("../../assets/plumb.jpg") },
    { id: "2", name: "Container Truck", image: require("../../assets/elec.jpg") },
    { id: "3", name: "Lorry", image: require("../../assets/paint.jpg") },
    { id: "4", name: "Small Lorry", image: require("../../assets/carp.jpg") },
    { id: "5", name: "Metador", image: require("../../assets/clean.jpg") },
    { id: "6", name: "High Cube Containers", image: require("../../assets/ac.jpg") },
];

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [selectedService, setSelectedService] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [date, setDate] = useState("");
    const [truckSize, setTruckSize] = useState("");

    const handleRequest = () => {
        // setModalVisible(false);
        navigation.navigate("MapScreen", {
            service: selectedService,
            bookingDetails: { pickup, drop, date, truckSize },
        });
        setPickup("");
        setDrop("");
        setDate("");
        setTruckSize("");
    };

    return (
        <LinearGradient colors={["#8B4000", "#FFC000"]} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.appTitle}>Trucko</Text>
                <Text style={styles.tagline}>Heavy Duty help, anytime</Text>

                {/* Search */}
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={20} color="gray" />
                    <TextInput
                        placeholder="Search services..."
                        placeholderTextColor="gray"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            {/* Services */}
            <View style={[styles.servicesContainer, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>Popular Services</Text>
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item,navigation }) => (
                        <TouchableOpacity
                            style={styles.card}
                            
                            onPress={() => {
                                handleRequest();
                            }}
                        >
                            <Image source={item.image} style={styles.cardImageFull} />
                            <View style={styles.overlay}>
                                <Text style={styles.overlayText}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Promo Banner */}
            <View style={[styles.banner, { marginBottom: insets.bottom + 0 }]}>
                <MaterialCommunityIcons name="sale" size={30} color="white" />
                <Text style={styles.bannerText}>Flat 20% OFF on First Booking!</Text>
            </View>


        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 20,
        paddingTop: 50,
    },
    appTitle: { fontSize: 26, fontWeight: "bold", color: "white" },
    tagline: { fontSize: 14, color: "#d1d5db", marginBottom: 15 },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    searchInput: { flex: 1, marginLeft: 5, color: "black" },
    servicesContainer: { paddingHorizontal: 20, paddingTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 15 },
    card: {
        width: "48%",
        aspectRatio: 1,
        borderRadius: 15,
        overflow: "hidden",
        elevation: 3,
    },
    cardImageFull: { width: "100%", height: "100%", resizeMode: "cover" },
    overlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingVertical: 8,
        alignItems: "center",
    },
    overlayText: { color: "white", fontSize: 16, fontWeight: "bold" },
    banner: {
        flexDirection: "row",
        backgroundColor: "#000",
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    bannerText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 10 },

    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        
    },
   modalContent: {
    width: "100%",               // <-- make modal width 90% of screen
    // backgroundColor: "#dbda8fff",
    borderRadius: 40,
    paddingVertical: 20,        // add padding inside modal
    paddingHorizontal: 15,
    elevation: 20,
},


    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
    width: "100%",           // full width inside the modal
    alignSelf: "center",    // center inside modal
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 15,       // more rounded for premium feel
    paddingVertical: 14,    // taller input
    paddingHorizontal: 15,  // horizontal padding
    marginBottom: 15,       // spacing between inputs
    fontSize: 16,           // slightly bigger text
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.2)", // subtle translucent background
},

    requestButton: {         
    backgroundColor: "black",
    alignItems: "center",
    marginTop: 10,
    borderRadius:20,
    overflow: "hidden", 
    paddingVertical: 12, 
    left:50,
    width: "60%"
},
    gradientButton: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        width: "100%"
    },
    requestText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    closeButton: { marginTop: 15, alignItems: "center" },
    closeText: { color: "gray", fontWeight: "600" },
});
