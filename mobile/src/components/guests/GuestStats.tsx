import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface GuestStatsProps {
    total: number;
    confirmed: number;
    pending: number;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    onFilterPress?: () => void;
}

export function GuestStats({
    total,
    confirmed,
    pending,
    searchQuery,
    setSearchQuery,
    onFilterPress,
}: GuestStatsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Floating card container */}
            <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard label="Total" value={total} colors={colors} />
                    <StatCard label="Confirmed" value={confirmed} colors={colors} />
                    <StatCard label="Pending" value={pending} colors={colors} />
                </View>

                {/* Search and Filters Section */}
                <View style={styles.searchRow}>
                    <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
                        <Ionicons name="search-outline" size={20} color={colors.secondary} style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search Guest"
                            placeholderTextColor={colors.placeholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={[styles.searchInput, { color: colors.text }]}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: colors.inputBackground }]}
                        onPress={onFilterPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="options-outline" size={22} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function StatCard({ label, value, colors }: { label: string; value: number; colors: any }) {
    return (
        <View style={[styles.card, { backgroundColor: colors.inputBackground }]}>
            <ThemedText
                style={styles.value}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {value}
            </ThemedText>
            <ThemedText style={styles.label} lightColor={colors.secondary} darkColor={colors.secondary}>{label}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 20,
        zIndex: 2,
    },
    cardContainer: {
        borderRadius: 24,
        padding: 20,
        // Premium floating shadow - matching CountdownBanner
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    card: {
        flex: 1,
        height: 120,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    value: {
        fontSize: 32,
        fontWeight: "800",
        letterSpacing: -1,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 4,
    },
    searchRow: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        marginTop: 20,
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        height: 52,
        borderRadius: 20,
        paddingHorizontal: 16,
        // Match StatCard shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        height: '100%',
    },
    filterButton: {
        width: 52,
        height: 52,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        // Match StatCard shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
});
