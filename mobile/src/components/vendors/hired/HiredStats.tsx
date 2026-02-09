import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HiredStatsProps {
    budget: number;
    paid: number;
    pending: number;
}

export function HiredStats({ budget, paid, pending }: HiredStatsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <StatCard
                label="Budget"
                value={budget}
                icon="wallet-outline"
                iconColor={colors.expensePurple}
                colors={colors}
            />
            <StatCard
                label="Paid"
                value={paid}
                icon="check-decagram-outline"
                iconColor={colors.success}
                colors={colors}
            />
            <StatCard
                label="Pending"
                value={pending}
                icon="dots-horizontal-circle-outline"
                iconColor={colors.warning}
                colors={colors}
            />
        </View>
    );
}

function StatCard({ label, value, icon, iconColor, colors }: { label: string; value: number; icon: any; iconColor: string; colors: any }) {
    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={[styles.iconWrapper, { backgroundColor: iconColor + "15" }]}>
                <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
            </View>
            <ThemedText style={styles.label} lightColor={colors.secondary} darkColor={colors.secondary}>
                {label}
            </ThemedText>
            <ThemedText style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                Rs. {value.toLocaleString()}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        gap: 12,
        marginTop: 10,
        zIndex: 2,
    },
    card: {
        flex: 1,
        borderRadius: 24,
        padding: 16,
        alignItems: "flex-start",
        // Premium subtle shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
    },
    value: {
        fontSize: 16,
        fontWeight: "800",
        marginTop: 4,
        includeFontPadding: false,
    },
});
