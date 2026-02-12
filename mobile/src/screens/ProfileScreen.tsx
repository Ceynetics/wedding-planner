import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMenuItem, ProfileMenuSection } from "@/components/profile/ProfileMenuSection";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const { theme, toggleTheme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

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

    const handleLogout = () => {
        router.replace("/" as any);
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <ProfileHeader
                        name="John Michael"
                        email="john@gmail.com"
                        onEditPress={() => console.log("Edit profile pressed")}
                    />

                    <ProfileMenuSection title="Wedding Details" items={weddingDetails} />

                    <ProfileMenuSection title="Account & Security" items={accountSecurity} />

                    <ProfileMenuSection title="Preferences" items={preferences} />

                    <ProfileActions
                        onLogoutPress={handleLogout}
                        onDeleteEventPress={() => console.log("Delete Event pressed")}
                    />
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    content: {
        paddingHorizontal: 24,
        marginTop: 10,
    }
});
