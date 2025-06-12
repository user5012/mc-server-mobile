import { clearAllData } from "@/assets/scripts/storage";
import StyleBtn from "@/components/ui/StyledBtn";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#130943",
      }}
    >
      <View
        style={{
          width: "100%",
          paddingVertical: 100,
          backgroundColor: "#131834",
          alignItems: "center",
          marginBottom: 24,
          elevation: 4, // for subtle shadow on Android
          shadowColor: "#000", // for iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          Minecraft Server Host
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            marginTop: 20,
            width: "90%",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: "#2d3748",
              fontSize: 18,
              textAlign: "center",
              lineHeight: 26,
            }}
          >
            Welcome to{" "}
            <Text style={{ fontWeight: "bold", color: "#3182ce" }}>
              Minecraft Server Host
            </Text>
            . Here we make it possible to make your phone a server for
            minecraft.
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <StyleBtn
          text="Configure Server"
          task={() => {
            router.push("/configure-server-type");
          }}
        />
        <StyleBtn text="delete storage" task={async () => {
          await clearAllData();
        }
        }
        />
      </View>
    </View>
  );
}
