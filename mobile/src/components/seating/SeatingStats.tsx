import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SeatingStatsProps {
    totalGuests: number;
    totalSeats: number;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    onFilterPress?: () => void;
}

export function SeatingStats({
    totalGuests,
    totalSeats,
    searchQuery,
    setSearchQuery,
    onFilterPress,
}: SeatingStatsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Main Floating Card */}
            <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        label="Total Guests"
                        value={totalGuests}
                        image={require("../../../assets/icons/guests.png")}
                        colors={colors}
                    />
                    <StatCard
                        label="Total Seats"
                        value={totalSeats}
                        image={require("../../../assets/icons/seating.png")}
                        colors={colors}
                    />
                </View>

                {/* Search and Filters Section */}
                <View style={styles.searchRow}>
                    {/* Search Container - Using neutral 'background' for better contrast */}
                    <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
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
                        style={[styles.filterButton, { backgroundColor: colors.background }]}
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

function StatCard({ label, value, image, colors }: { label: string; value: number; image: ImageSourcePropType; colors: any }) {
    return (
        /* Stat card background changed to 'background' (Smoke White) for better visibility */
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <View style={styles.statContent}>
                <ThemedText style={styles.statLabel} lightColor={colors.secondary} darkColor={colors.secondary}>
                    {label}
                </ThemedText>
                <ThemedText style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                    {value}
                </ThemedText>
            </View>
            <View style={styles.iconContainer}>
                <Image
                    source={image}
                    style={[styles.statImage]}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginTop: 10,
        zIndex: 2,
    },
    cardContainer: {
        borderRadius: 24,
        padding: 20,
        // Premium floating shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
    },
    statCard: {
        flex: 1,
        height: 100,
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    statContent: {
        flex: 1,
        height: "100%",
        justifyContent: "space-between",
    },
    statLabel: {
        fontSize: 13,
        fontWeight: "600",
    },
    statValue: {
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: -1,
        includeFontPadding: false,
    },
    iconContainer: {
        position: "absolute",
        right: 12,
        bottom: 12,
    },
    statImage: {
        width: 80,
        height: 80,
        marginRight: -15,
        marginBottom: -20
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
        // Inner shadow
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
        // Inner shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
});
