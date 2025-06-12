import { Stack } from "expo-router";
import React from "react";

export default function ExternalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, title: "" }}>
      <Stack.Screen
        name="configure-server"
        options={{ headerShown: false, title: "" }}
      />
    </Stack>
  );
}
