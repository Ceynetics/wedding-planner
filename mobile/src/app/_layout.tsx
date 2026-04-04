import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
              <Stack.Screen name="(forms)" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(tools)" />
              <Stack.Screen name="notifications" options={{ animation: "slide_from_right" }} />
            </Stack>
          </SafeAreaProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
