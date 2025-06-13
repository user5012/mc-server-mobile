import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsolePage() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("Fetching console output...");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Fetch console output when screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchOutput = async () => {
        try {
          const response = await fetch("https://your-backend/api/console");
          if (!response.ok) throw new Error("Server error");
          const data = await response.json();
          setOutput(data.output || "Console is empty.");
        } catch (error) {
          setOutput("Server is offline.");
        }
      };
      fetchOutput();
    }, [])
  );

  const sendCommand = async (cmd: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://your-backend/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await response.json();
      setOutput((prev) => prev + "\n> " + cmd + "\n" + data.output);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setOutput((prev) => prev + "\n> " + cmd + "\n" + "Error: " + errorMsg);
    }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const onSubmit = () => {
    const trimmed = command.trim();
    if (!trimmed) return;
    sendCommand(trimmed);
    setCommand("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
      >
        <View
          style={[
            styles.outputWrapper,
            keyboardVisible && styles.outputWrapperKeyboard,
          ]}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.outputContainer}
            contentContainerStyle={styles.outputContent}
          >
            <Text style={styles.outputText}>{output}</Text>
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={command}
            onChangeText={setCommand}
            onSubmitEditing={onSubmit}
            placeholder="Enter command..."
            placeholderTextColor="#999"
            style={styles.input}
            editable={!loading}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={onSubmit}
            disabled={loading || !command.trim()}
            style={[
              styles.sendButton,
              (loading || !command.trim()) && styles.disabledButton,
            ]}
          >
            <Text style={styles.sendButtonText}>
              {loading ? "Sending..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  outputWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  outputWrapperKeyboard: {
    flex: 0.6,
  },
  outputContainer: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
  },
  outputContent: {
    paddingBottom: 20,
  },
  outputText: {
    color: "#0f0",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
