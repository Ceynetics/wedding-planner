import { Stack } from 'expo-router';

export default function FormsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
            <Stack.Screen name="tasks/add" />
            <Stack.Screen name="guests/add" />
            <Stack.Screen name="expenses/add" />
        </Stack>
    );
}
