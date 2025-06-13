import { makeServer } from "@/assets/scripts/createserver";
import { saveInfo } from "@/assets/scripts/storage";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import versionsDataVanila from "../../assets/data/servers.json";

export default function ConfigureVersionScreen() {

  const params = useSearchParams();
  const type = params.get("type")


  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [serverName, setServerName] = useState("");
  const [domain, setDomain] = useState("");

  const handleSubmit = async () => {
    if (!selectedVersion || !serverName || !domain) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }

    const downloadLink = versionsDataVanila[selectedVersion as keyof typeof versionsDataVanila]; //MAKE COMPILER STFU
    console.log({
      serverName,
      domain,
      version: selectedVersion,
      jarUrl: downloadLink,
      type
    });

    await makeServer(serverName, downloadLink);

    await saveInfo({
      domain: domain,
      type: type ?? '', //make ts shutup
      version: selectedVersion,
      name: serverName,
      jar_url: downloadLink
    })

    router.push("/servers-list")


    // You can continue to next step here (like saving config or navigating)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Configure Your Server</Text>

        <TextInput
          placeholder="Server Name"
          value={serverName}
          onChangeText={setServerName}
          style={styles.input}
        />

        <TextInput
          placeholder="Domain (e.g. play.mysite.net)"
          value={domain}
          onChangeText={setDomain}
          style={styles.input}
        />

        <Text style={styles.subtitle}>Select Minecraft Version</Text>
        <FlatList
          data={Object.keys(versionsDataVanila)}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.versionButton,
                selectedVersion === item && styles.versionSelected,
              ]}
              onPress={() => setSelectedVersion(item)}
            >
              <Text
                style={[
                  styles.versionText,
                  selectedVersion === item && { color: "#fff" },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
          <Text style={styles.submitText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  versionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  versionSelected: {
    backgroundColor: "#3498DB",
  },
  versionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  submit: {
    backgroundColor: "#2ECC71",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  submitText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
