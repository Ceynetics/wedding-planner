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
            <StatCard label="Total" value={total} colors={colors} />
            <StatCard label="Confirmed" value={confirmed} colors={colors} />
            <StatCard label="Pending" value={pending} colors={colors} />
        </View>
    );
}

function StatCard({ label, value, colors }: { label: string; value: number; colors: any }) {
    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
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
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        gap: 12,
        marginTop: 20,
    },
    card: {
        flex: 1,
        height: 120, // Slightly taller as in design
        borderRadius: 24, // Very rounded
        justifyContent: "center",
        alignItems: "center",
        // Premium subtle shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
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
