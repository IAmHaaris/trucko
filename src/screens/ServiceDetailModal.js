import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AddModal from "./AddModal";
import RequestModal from "./RequestModal"; // make sure path is correct

const { height, width } = Dimensions.get("window");

export default function ServiceDetailModal({ serviceName, data, onClose }) {
  const items = data[serviceName];
  const [currentItem, setCurrentItem] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [requestVisible, setRequestVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Image */}
        <Image source={items[0].image} style={styles.topImage} />

        {/* Bottom Section with Gradient */}
        <LinearGradient
          colors={["#000000", "#1E3A8A"]}
          style={[
            styles.bottomSection,
            { paddingBottom: checkoutTotal > 0 ? 100 : 20 }, // ✅ padding stays inside gradient
          ]}
        >
          {/* Curved Top Indicator */}
          <View style={styles.curveIndicator} />

          {/* Service Name */}
          <Text style={styles.serviceTitle}>{serviceName}</Text>

          {/* Work Items */}
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={item.image} style={styles.itemImage} />

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
                {item.duration && (
                  <Text style={styles.itemDuration}>{item.duration}</Text>
                )}
                {item.tags && item.tags.length > 0 && (
                  <View style={styles.tagContainer}>
                    {item.tags.map((tag, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Add Button */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setAddModalVisible(true);
                  setCurrentItem(item);
                }}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </LinearGradient>
      </ScrollView>

      {/* ✅ Fixed Checkout Bar */}
      {checkoutTotal > 0 && (
        <LinearGradient
          colors={["#000000", "#1E3A8A"]}
          style={styles.checkoutBar}
        >
          <Text style={styles.totalText}>Approx price: ₹{checkoutTotal}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => setRequestVisible(true)}
            >
            <Text style={styles.checkoutButtonText}>Request Service</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Modal */}
      <AddModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        serviceName={serviceName}
        onDone={(total) => setCheckoutTotal(total)}
        items={items}
      />
      {/* Request Service Modal */}
{requestVisible && (
  <RequestModal
    visible={requestVisible}
    onClose={() => setRequestVisible(false)}
  />
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ required so absolute works
    backgroundColor: "transparent",
  },
  topImage: {
    width: "100%",
    height: height * 0.6,
    resizeMode: "cover",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    minHeight: height * 0.5,
  },
  curveIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
  },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 18, fontWeight: "600", color: "white" },
  itemPrice: { fontSize: 16, color: "#d1d5db", marginTop: 4 },
  itemDuration: { fontSize: 13, color: "#cfd8dc", marginTop: 2 },
  tagContainer: { flexDirection: "row", marginTop: 4, flexWrap: "wrap" },
  tag: {
    backgroundColor: "#1E3A8A",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 5,
    marginTop: 2,
  },
  tagText: { color: "white", fontSize: 12 },
  addButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: "center",
    marginLeft: 10,
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  // ✅ Fixed Checkout Bar
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  totalText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  checkoutButtonText: { color: "#1E3A8A", fontWeight: "bold", fontSize: 16 },
});
