import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, TextInput, Modal } from "react-native";
import ServiceDetailModal from "./ServiceDetailModal";
import servicesData from "../../data/servicesData";
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

export default function HomeScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const [selectedService, setSelectedService] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
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

            {/* Services Grid */}
            <View style={[styles.servicesContainer, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>Popular Services</Text>
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        // <TouchableOpacity
                        //     style={styles.card}
                        //     onPress={() => {
                        //         setSelectedService(item.name);
                        //         setModalVisible(true);
                        //     }}
                        // >
                        //     <Image source={item.image} style={styles.cardImageFull} />
                        //     <View style={styles.overlay}>
                        //         <Text style={styles.overlayText}>{item.name}</Text>
                        //     </View>
                        // </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => {
                                navigation.navigate("MapScreen", { service: item });
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
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setModalVisible(false)}
            >
                {selectedService && (
                    <ServiceDetailModal
                        serviceName={selectedService}
                        data={servicesData}
                        onClose={() => setModalVisible(false)}
                    />
                )}
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    cardImage: { width: 60, height: 60, resizeMode: "contain", marginBottom: 8 },

    // Header
    header: { padding: 20, paddingTop: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    appTitle: { fontSize: 22, fontWeight: "bold", color: "white" },
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

    // Services
    servicesContainer: { paddingHorizontal: 20, paddingTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 15 },
    card: {
        width: "48%",
        aspectRatio: 1,
        borderRadius: 15,
        overflow: "hidden", // important so overlay and image respect border radius
        marginBottom: 15,
        elevation: 3,
    },

    cardImageFull: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent black overlay
        paddingVertical: 8,
        alignItems: "center",
    },

    overlayText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    cardText: { marginTop: 8, fontSize: 16, fontWeight: "600" },

    // Banner
    banner: {
        flexDirection: "row",
        backgroundColor: "#000000",
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    bannerText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 10 },
});
