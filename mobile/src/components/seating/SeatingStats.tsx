import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SeatingStatsProps {
    totalGuests: number;
    totalSeats: number;
}

export function SeatingStats({ totalGuests, totalSeats }: SeatingStatsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <StatCard
                label="Total Guests"
                value={totalGuests}
                icon="account-group"
                colors={colors}
            />
            <StatCard
                label="Total Seats"
                value={totalSeats}
                icon="chair-school"
                colors={colors}
            />
        </View>
    );
}

function StatCard({ label, value, icon, colors }: { label: string; value: number; icon: any; colors: any }) {
    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.content}>
                <ThemedText style={styles.label} lightColor={colors.secondary} darkColor={colors.secondary}>
                    {label}
                </ThemedText>
                <ThemedText style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                    {value}
                </ThemedText>
            </View>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={40} color={colors.secondary + '40'} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        gap: 16,
        marginTop: 10,
        zIndex: 2,
    },
    card: {
        flex: 1,
        height: 120,
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        // Premium subtle shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    content: {
        flex: 1,
        height: "100%",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
    },
    value: {
        fontSize: 36,
        fontWeight: "800",
        letterSpacing: -1,
        lineHeight: 44,
        includeFontPadding: false,
    },
    iconContainer: {
        position: "absolute",
        right: 15,
        bottom: 15,
    },
});
