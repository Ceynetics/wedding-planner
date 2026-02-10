import { Stack } from 'expo-router';

export default function ToolsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="expenses" />
            <Stack.Screen name="seating" />
            <Stack.Screen name="vendors" />
            <Stack.Screen name="files" />
        </Stack>
    );
}
