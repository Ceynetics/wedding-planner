import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function NotificationsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            <NotificationHeader onClose={() => router.back()} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Content will go here in next steps */}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});
