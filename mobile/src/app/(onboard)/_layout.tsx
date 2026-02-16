import { Stack } from "expo-router";

export default function OnboardLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboard_one" />
            <Stack.Screen name="onboard_two" />
            <Stack.Screen name="workspace" />
        </Stack>
    );
}
