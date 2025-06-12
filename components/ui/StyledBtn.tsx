import { Runnable, Text, TouchableOpacity } from "react-native";

interface props {
  task: Runnable;
  text: string;
}

export default function StyleBtn({ task, text }: props) {
  return (
    <TouchableOpacity
      onPress={task}
      style={{
        backgroundColor: "#3182ce",
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 36,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
