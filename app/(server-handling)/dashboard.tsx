import { IpAddress } from "@/assets/scripts/networking";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Dashboard() {
  const serverName = "server_name_placeholder";
  const serverVersion = "version_placeholder";
  const serverType = "type_placeholder";
  const [active, setActive] = useState(false);
  const animation = useRef(new Animated.Value(0)).current; // 0 = red, 1 = green
  const [backendIP, setBackendIP] = useState<string | null>(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const ip = await IpAddress; // ← move it here
        const res = await fetch(`http://${ip}:3000/ip`);
        const data = await res.json();
        setBackendIP(data.ip);
      } catch (err) {
        console.error("Failed to fetch IP:", err);
      }
    };
    fetchIP();
  }, []);

  const toggle = async () => {
    if (!backendIP) return console.warn("No backend IP yet");

    try {
      const statusRes = await fetch(`http://${backendIP}:3000/status`);
      const statusData = await statusRes.json();

      if (!statusData.running) {
        // Start server
        await fetch(`http://${backendIP}:3000/start`, {
          method: "POST",
        });
        setActive(true);
        Animated.timing(animation, {
          toValue: 1, // green
          duration: 400,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }).start();
      } else {
        // Stop server via command
        await fetch(`http://${backendIP}:3000/command`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: "stop" }),
        });
        setActive(false);
        Animated.timing(animation, {
          toValue: 0, // red
          duration: 400,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }).start();
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  // Interpolate animated value to colors
  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ff4d4d", "#4CAF50"], // red to green
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.serverName}>{serverName}</Text>
        <Text style={styles.serverMeta}>
          {serverVersion} · {serverType}
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.placeholder}>
          🛠️ Dashboard content coming soon...
        </Text>
      </View>
      <TouchableWithoutFeedback onPress={toggle}>
        <Animated.View style={[styles.button, { backgroundColor }]}>
          <Text style={styles.text_btn}>{active ? "Active" : "Inactive"}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // White background
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  serverName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000", // Black text
  },
  serverMeta: {
    fontSize: 16,
    color: "#222", // Dark gray (close to black)
    marginTop: 4,
  },
  body: {
    backgroundColor: "#f9f9f9", // Slightly off-white for card
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  placeholder: {
    fontSize: 16,
    color: "#555", // Medium gray placeholder text
    textAlign: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  text_btn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
