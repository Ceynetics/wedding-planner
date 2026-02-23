import { SeatingHeader } from "@/components/seating/SeatingHeader";
import { SeatingStats } from "@/components/seating/SeatingStats";
import { TableCard } from "@/components/seating/TableCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SeatingScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");

    const tables = [
        { id: "1", name: "Head Table", description: "Table 1", currentGuests: 7, maxGuests: 10, isVip: true },
        { id: "2", name: "Head Table", description: "Table 2", currentGuests: 7, maxGuests: 10, isVip: false },
        { id: "3", name: "Head Table", description: "Table 3", currentGuests: 7, maxGuests: 10, isVip: false },
        { id: "4", name: "Head Table", description: "Table 4", currentGuests: 7, maxGuests: 10, isVip: true },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            <SeatingHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
            >
                <SeatingStats
                    totalGuests={120}
                    totalSeats={135}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onFilterPress={() => console.log("Filter pressed")}
                />

                <View style={styles.listContainer}>
                    {tables.map((table) => (
                        <TableCard
                            key={table.id}
                            {...table}
                            onPress={() => router.push(`/(tools)/seating/${table.id}` as any)}
                        />
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.bottomActions, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <TouchableOpacity
                    style={[styles.floorPlanButton, { backgroundColor: theme === 'light' ? colors.brideTagBg : colors.card }]}
                    onPress={() => router.push("/(tools)/seating/floor-plan")}
                >
                    <MaterialCommunityIcons name="view-grid-outline" size={24} color={colors.primary} />
                    <ThemedText style={styles.floorPlanText} lightColor={colors.primary} darkColor={colors.primary}>
                        View Floor Plan
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.emphasis }]}
                    onPress={() => router.push("/(forms)/seating/add" as any)}
                >
                    <Ionicons name="add" size={32} color={colors.primaryContrast} />
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        // Space handled by insets in JSX
    },
    listContainer: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    bottomActions: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
    },
    floorPlanButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        height: 56,
        borderRadius: 20,
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    floorPlanText: {
        fontSize: 16,
        fontWeight: "700",
    },
    fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
});
