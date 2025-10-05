import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // After 2 seconds go to SignIn screen
    const timer = setTimeout(() => {
      navigation.replace("SignIn");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#FFC000", "#000000"]} // Black → Blue
      style={styles.container}
    >
      <Text style={styles.title}>Trucko</Text>
      <Text style={styles.subtitle}>
        Heavy Duty · Trucks · Lorry · wheeler
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#d1d5db",
  },
});
