import { ToolCard } from "@/components/tools/ToolCard";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ToolsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    const router = useRouter();

    const tools = [
        {
            title: "Expenses",
            subtitle: "Manage your all expenses here",
            imageSource: require("../../assets/icons/money.png"),
            onPress: () => router.push("/expenses"),
        },
        {
            title: "Seating",
            subtitle: "Plan Table Positions and Seating",
            imageSource: require("../../assets/icons/seating.png"),
            onPress: () => router.push("/seating"),
        },
        {
            title: "Vendors",
            subtitle: "Manage Vendors Easily",
            imageSource: require("../../assets/icons/vendor.png"),
            onPress: () => router.push("/vendors"),
        },
        {
            title: "Invitations",
            subtitle: "Customize your Invitations",
            imageSource: require("../../assets/icons/invitations.png"),
            onPress: () => console.log("Invitations pressed"),
        },
        {
            title: "Files",
            subtitle: "Add your Bills and Docs Here",
            imageSource: require("../../assets/icons/drawer.png"),
            onPress: () => router.push("/files"),
        },
        {
            title: "Calendar",
            subtitle: "View your Plans on The Calendar",
            imageSource: require("../../assets/icons/calender.png"),
            onPress: () => console.log("Calendar pressed"),
        },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>

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
