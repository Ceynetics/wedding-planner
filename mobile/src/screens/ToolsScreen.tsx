import { ToolCard } from "@/components/tools/ToolCard";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ToolsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    // Matching the gradient from TaskHeader and previous Guest design
    const gradientColors = (theme === "light"
        ? [colors.primary + "40", colors.primary + "10"]
        : [colors.primary + "60", colors.background]) as [string, string, ...string[]];

    const router = useRouter();

    const tools = [
        {
            title: "Expenses",
            subtitle: "Manage your all expenses here",
            icon: "wallet-outline" as const,
            onPress: () => router.push("/expenses"),
        },
        {
            title: "Seating",
            subtitle: "Plan Table Positions and Seating",
            icon: "table-chair" as const,
            onPress: () => router.push("/seating"),
        },
        {
            title: "Vendors",
            subtitle: "Manage Vendors Easily",
            icon: "account-group-outline" as const,
            onPress: () => console.log("Vendors pressed"),
        },
        {
            title: "Invitations",
            subtitle: "Customize your Invitations",
            icon: "email-edit-outline" as const,
            onPress: () => console.log("Invitations pressed"),
        },
        {
            title: "Files",
            subtitle: "Add your Bills and Docs Here",
            icon: "folder-open-outline" as const,
            onPress: () => console.log("Files pressed"),
        },
        {
            title: "Calendar",
            subtitle: "View your Plans on The Calendar",
            icon: "calendar-month-outline" as const,
            onPress: () => console.log("Calendar pressed"),
        },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.gradient, { height: 300 + insets.top }]}
            /> */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
            >
                <View style={styles.grid}>
                    {tools.map((tool, index) => (
                        <View key={index} style={styles.cardWrapper}>
                            <ToolCard {...tool} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "space-between",
    },
    cardWrapper: {
        width: "47.5%", // Adjusted for 2 columns with gap
        marginBottom: 4,
    },
});
