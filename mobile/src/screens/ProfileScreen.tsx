import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMenuItem, ProfileMenuSection } from "@/components/profile/ProfileMenuSection";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const { theme, toggleTheme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { user, logout } = useAuth();

    const weddingDetails: ProfileMenuItem[] = [
        { id: "date", label: "Wedding Date", icon: "calendar-outline", onPress: () => { } },
        { id: "partner", label: "Partner Invite", icon: "heart-outline", onPress: () => { } },
        { id: "info", label: "Other Info", icon: "folder-outline", onPress: () => { } },
    ];

    const accountSecurity: ProfileMenuItem[] = [
        { id: "email", label: "E-mail", icon: "mail-outline", onPress: () => { } },
        { id: "password", label: "Change Password", icon: "ellipsis-horizontal", onPress: () => { } },
        { id: "security", label: "Other Security Settings", icon: "shield-outline", onPress: () => { } },
    ];

    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const preferences: ProfileMenuItem[] = [
        {
            id: "notifications",
            label: "Push Notifications",
            icon: "notifications-outline",
            type: "switch",
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled
        },
        {
            id: "dark-mode",
            label: "Dark Mode",
            icon: "sunny-outline",
            type: "switch",
            value: theme === "dark",
            onValueChange: toggleTheme
        },
    ];

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            {/* Fixed Header Section */}
            <View style={styles.fixedSection}>
                <ProfileHeader
                    name={user?.fullName || 'User'}
                    email={user?.email || ''}
                    onEditPress={() => router.push("/(forms)/profile/edit" as any)}
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.scrollContent}
            >
                <ProfileMenuSection title="Wedding Details" items={weddingDetails} />

                <ProfileMenuSection title="Account & Security" items={accountSecurity} />

                <ProfileMenuSection title="Preferences" items={preferences} />

                <ProfileActions
                    onLogoutPress={handleLogout}
                    onDeleteAccountPress={() => router.push("/(auth)/register" as any)}
                />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixedSection: {
        zIndex: 10,
        marginTop: 50, // Lower the header area slightly
        paddingBottom: 20,
    },
    content: {
        paddingHorizontal: 24,
        marginTop: 10,
    }
});
