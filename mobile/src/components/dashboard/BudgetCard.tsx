import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BudgetCardProps {
    totalBudget: number;
    spentAmount: number;
    currency?: string;
}

export function BudgetCard({
    totalBudget,
    spentAmount,
    currency = "Rs.",
}: BudgetCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const remaining = totalBudget - spentAmount;
    const progress = Math.min(Math.max(spentAmount / totalBudget, 0), 1);

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: colors.primary + "15" },
                    ]}
                >
                    <Ionicons name="card" size={18} color={colors.primary} />
                </View>
                <ThemedText style={[styles.title, { color: colors.primary }]}>
                    Budget
                </ThemedText>
            </View>

            <View style={styles.infoRow}>
                <ThemedText style={styles.totalText}>
                    Total Budget - <ThemedText style={styles.boldText}>{totalBudget.toLocaleString()}.00</ThemedText>
                </ThemedText>
                <ThemedText style={styles.remainingText}>
                    {currency} {remaining.toLocaleString()} Left
                </ThemedText>
            </View>

            <View style={[styles.progressBarBg, { backgroundColor: colors.background }]}>
                <View
                    style={[
                        styles.progressBarFill,
                        {
                            width: `${progress * 100}%`,
                            backgroundColor: colors.primary,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 24,
        // Premium floating effect
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 10,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 12,
    },
    totalText: {
        fontSize: 13,
        opacity: 0.7,
    },
    boldText: {
        fontWeight: "600",
    },
    remainingText: {
        fontSize: 11,
        opacity: 0.5,
    },
    progressBarBg: {
        height: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 5,
    },
});
