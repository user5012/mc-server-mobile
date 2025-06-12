import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const serverTypes = [
  { name: "Spigot", color: "#E67E22" },
  { name: "Paper", color: "#3498DB" },
  { name: "Vanilla", color: "#2ECC71" },
  { name: "Fabric", color: "#9B59B6" },
  { name: "Forge", color: "#E74C3C" },
];

export default function ConfigureServerScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (name: string) => {
    setSelected(name);
    // You can navigate or store selection here
    console.log("Selected server type:", name);
    router.push({
      pathname: "/configure-server-version",
      params: { type: name }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Server Type</Text>
      <FlatList
        data={serverTypes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              {
                backgroundColor:
                  selected === item.name ? item.color : "#f0f0f0",
              },
            ]}
            onPress={() => handleSelect(item.name)}
          >
            <Text
              style={[
                styles.optionText,
                { color: selected === item.name ? "#fff" : "#333" },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.optionsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#222",
  },
  optionsList: {
    gap: 16,
  },
  option: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
