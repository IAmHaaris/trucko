import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Modal } from "react-native";

export default function RequestModal({ visible, onClose }) {
  const [phase, setPhase] = useState("finding"); // finding | requests | confirmed
  const [requests, setRequests] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Simulate finding workers
  useEffect(() => {
    if (phase === "finding") {
      const timer = setTimeout(() => {
        setRequests([
          { id: "1", name: "Ravi", price: 250, time: "15 mins" },
          { id: "2", name: "Arjun", price: 220, time: "12 mins" },
          { id: "3", name: "Sameer", price: 280, time: "18 mins" },
        ]);
        setPhase("requests");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleAccept = (worker) => {
    setSelectedWorker(worker);
    setPhase("confirmed");
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (requests.length === 1) setPhase("finding");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Top searching area */}
        {phase === "finding" && (
          <View style={styles.searchingArea}>
            <ActivityIndicator size="large" color="#1E3A8A" />
            <Text style={styles.searchingText}>Finding workers near you…</Text>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom modal */}
        {(phase === "requests" || phase === "confirmed") && (
          <View style={styles.bottomModal}>
            {phase === "requests" && (
              <>
                <Text style={styles.title}>Workers Available</Text>
                <FlatList
                  data={requests}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text>💰 {item.price} ₹</Text>
                      <Text>⏱ {item.time}</Text>
                      <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
                          <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item)}>
                          <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {phase === "confirmed" && selectedWorker && (
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Booking Confirmed ✅</Text>
                <Text style={styles.name}>{selectedWorker.name}</Text>
                <Text>ETA: {selectedWorker.time}</Text>
                <Text>Fare: ₹{selectedWorker.price}</Text>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  searchingArea: { height: "60%", backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  searchingText: { fontSize: 18, fontWeight: "bold", color: "#1E3A8A", marginTop: 10 },
  bottomModal: { maxHeight: "60%", backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#1E3A8A" },
  card: { backgroundColor: "#f9fafb", padding: 12, borderRadius: 10, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  acceptBtn: { backgroundColor: "green", padding: 8, borderRadius: 8, minWidth: 70, alignItems: "center" },
  acceptText: { color: "white", fontWeight: "bold" },
  rejectBtn: { backgroundColor: "red", padding: 8, borderRadius: 8, minWidth: 70, alignItems: "center" },
  rejectText: { color: "white", fontWeight: "bold" },
  cancelBtn: { marginTop: 10, padding: 10, borderRadius: 8, backgroundColor: "#f3f4f6", alignItems: "center" },
  cancelText: { color: "red", fontWeight: "bold" },
});
