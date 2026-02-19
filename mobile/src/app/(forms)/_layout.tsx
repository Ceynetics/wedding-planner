import { Stack } from 'expo-router';

export default function FormsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
            <Stack.Screen name="tasks/add" />
            <Stack.Screen name="guests/add" />
            <Stack.Screen name="expenses/add" />
            <Stack.Screen name="vendors/add" />
            <Stack.Screen name="seating/add" />
            <Stack.Screen name="profile/edit" />
            <Stack.Screen name="seating/select-guests" options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }} />
        </Stack>
    );
}
