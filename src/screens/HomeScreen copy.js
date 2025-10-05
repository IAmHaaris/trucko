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
    setModalVisible(false);
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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedService(item);
                setModalVisible(true);
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

      {/* Booking Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{selectedService?.name} Booking</Text>

              <TextInput
                placeholder="Pickup Location"
                placeholderTextColor="#999"
                style={styles.input}
                value={pickup}
                onChangeText={setPickup}
              />
              <TextInput
                placeholder="Drop Location"
                placeholderTextColor="#999"
                style={styles.input}
                value={drop}
                onChangeText={setDrop}
              />
              <TextInput
                placeholder="Truck Size (e.g., 14ft, 17ft)"
                placeholderTextColor="#999"
                style={styles.input}
                value={truckSize}
                onChangeText={setTruckSize}
              />
              <TextInput
                placeholder="Date & Time"
                placeholderTextColor="#999"
                style={styles.input}
                value={date}
                onChangeText={setDate}
              />

              <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
                <LinearGradient
                  colors={["#8B4000", "#FFC000"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.requestText}>Request Truck</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4000",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: "#333",
  },
  requestButton: { marginTop: 10, borderRadius: 10, overflow: "hidden" },
  gradientButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  requestText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: { marginTop: 15, alignItems: "center" },
  closeText: { color: "gray", fontWeight: "600" },
});
