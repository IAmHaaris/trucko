import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProposalList({ proposals, onAccept, onReject, onBack }) {
  const [driverList, setDriverList] = useState(proposals);

  const handleReject = (id) => {
    const updatedList = driverList.filter((driver) => driver.id !== id);
    setDriverList(updatedList);
    onReject && onReject(id);
  };

  const renderProposal = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.driverInfo}>
        <Image source={{ uri: item.photo }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.rating}>⭐ {item.rating || "4.8"}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(item)}>
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Driver Proposals</Text>
      </View>

      {/* List */}
      {driverList.length > 0 ? (
        <FlatList
          data={driverList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProposal}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.emptyView}>
          <Text style={{ color: "#aaa" }}>No proposals yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  rating: {
    color: "#ccc",
    marginTop: 3,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  acceptBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  rejectBtn: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
