import { getAllServers } from "@/assets/scripts/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Server = {
  name: string;
  domain: string;
  type: string;
  version: string;
};

export default function ServerList() {
  const [servers, setServers] = useState<Server[] | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function fetchServers() {
        try {
          const data = await getAllServers();
          setServers(data && data.length > 0 ? data : []);
        } catch (err) {
          setServers([]);
        }
      }

      fetchServers();
    }, [])
  );

  const handleAddServer = () => {
    // TODO: hook into navigation or add-server logic
    router.push("/configure-server-type");
  };

  const handleServerTabPress = () => {
    router.push("/console");
  };

  if (servers === null || servers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You don't have any servers yet.</Text>
        <TouchableOpacity onPress={handleAddServer} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add a Server</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {servers
          .reverse()
          .filter(
            (server) =>
              server.name?.trim() &&
              server.version?.trim() &&
              server.domain?.trim()
          )
          .map((server, index) => (
            <TouchableOpacity
              key={index}
              onPress={handleServerTabPress}
              style={styles.serverCard}
            >
              <Text style={styles.serverName}>{server.name}</Text>
              <View style={styles.serverDetails}>
                <Text style={styles.domain}>{server.domain}</Text>
                <Text style={styles.typeVersion}>
                  {server.type} / {server.version}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    elevation: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  scrollContainer: {
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  serverCard: {
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 2,
    padding: 16,
    marginBottom: 16,
  },
  serverName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  serverDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  domain: {
    fontSize: 16,
    color: "#4b5563",
  },
  typeVersion: {
    fontSize: 14,
    color: "#6b7280",
  },
});
