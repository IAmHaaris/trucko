import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function VerifyOTPScreen() {
  return (
    <LinearGradient colors={["#000000", "#1E3A8A"]} style={styles.container}>
      <Text style={styles.text}>Verify OTP Screen</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, color: "white" },
});
