import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function AddModal({ visible, onClose, serviceName, items, onDone }) {
  const [cart, setCart] = useState([]);

  const addItem = (item) => {
    setCart([...cart, item]);
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + (typeof item.price === "number" ? item.price : 0),
    0
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Top Black Header */}
          <View style={styles.topHeader}>
            <Text style={styles.serviceTitle}>{serviceName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Horizontal Scroll Items */}
            <FlatList
              data={items}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 15 }}
              renderItem={({ item }) => (
                <View style={styles.itemCard}>
                  <Image source={item.image} style={styles.itemImage} />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                  <Text style={styles.itemRating}>⭐ {item.rating || 4}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addItem(item)}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Other content if needed */}
            {/* ✅ How We Work Section */}
  <View style={styles.processContainer}>
    <Text style={styles.processTitle}>How We Work</Text>

    <View style={styles.step}>
      <Text style={styles.stepNumber}>1</Text>
      <Text style={styles.stepText}>Inspection by our expert at your location</Text>
    </View>

    <View style={styles.step}>
      <Text style={styles.stepNumber}>2</Text>
      <Text style={styles.stepText}>Get a confirmation & estimated cost before we start</Text>
    </View>

    <View style={styles.step}>
      <Text style={styles.stepNumber}>3</Text>
      <Text style={styles.stepText}>Service completed with full safety & quality checks</Text>
    </View>

    <View style={styles.step}>
      <Text style={styles.stepNumber}>4</Text>
      <Text style={styles.stepText}>Easy payment & satisfaction guarantee</Text>
    </View>
  </View>
          </ScrollView>

          {/* Bottom Bar fixed */}
          <LinearGradient
            colors={["#000000", "#1E3A8A"]}
            style={styles.bottomBar}
          >
            <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
            <TouchableOpacity
  style={styles.doneButton}
  onPress={() => {
    onDone(totalPrice); // send total back
    onClose(); // close modal
  }}
>
  <Text style={styles.doneButtonText}>Done</Text>
</TouchableOpacity>

          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 0.85,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
    padding: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  serviceTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  closeText: { color: "white", fontSize: 18 },
  itemsContainer: { paddingVertical: 15, paddingLeft: 10 },
  itemCard: {
    width: width * 0.45,
    marginRight: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
  },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemName: { fontSize: 16, fontWeight: "600", marginTop: 5 },
  itemPrice: { fontSize: 14, color: "gray", marginTop: 2 },
  itemRating: { fontSize: 14, color: "black", marginTop: 2 },
  addButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  addButtonText: { color: "white", fontWeight: "bold" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  totalText: { color: "white", fontSize: 18, fontWeight: "bold" },
  doneButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  doneButtonText: { color: "#1E3A8A", fontWeight: "bold", fontSize: 16 },
  processContainer: {
    padding: 20,
    marginTop: 10,
  },
  processTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1E3A8A",
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    marginRight: 10,
    textAlign: "center",
    lineHeight: 28,
  },
  stepText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  
});
