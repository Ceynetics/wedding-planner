import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

interface GuestStatsProps {
    total: number;
    confirmed: number;
    pending: number;
}

export function GuestStats({ total, confirmed, pending }: GuestStatsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Floating card container */}
            <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
                <View style={styles.statsGrid}>
                    <StatCard label="Total" value={total} colors={colors} />
                    <StatCard label="Confirmed" value={confirmed} colors={colors} />
                    <StatCard label="Pending" value={pending} colors={colors} />
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
        // Subtle shadow for individual cards
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
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
});
