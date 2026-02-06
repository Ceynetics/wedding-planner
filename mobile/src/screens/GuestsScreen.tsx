import { GuestHeader } from "@/components/guests/GuestHeader";
import { GuestStats } from "@/components/guests/GuestStats";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function GuestsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <GuestHeader />

                {/* Stats Summary Cards */}
                <View style={styles.statsContainer}>
                    <GuestStats total={124} confirmed={86} pending={24} />
                </View>

                {/* Note: Search bar and filters will be added next as per user's choice */}
            </ScrollView>
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
    statsContainer: {
        zIndex: 2,
    },
});
