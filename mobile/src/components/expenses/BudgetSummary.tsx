import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BudgetSummaryProps {
    spent: number;
    total: number;
    left: number;
}

export function BudgetSummary({ spent, total, left }: BudgetSummaryProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const progress = Math.min(spent / total, 1);

    // Use theme-aware red gradient for the budget card to match the Romantic Red theme
    const cardGradient = (theme === 'light'
        ? [colors.primary, colors.emphasis] // Vibrant Red to Darker Red
        : [colors.primary, colors.expenseRed]) as [string, string, ...string[]]; // Lighter Red to Soft Red

    return (
        <LinearGradient
            colors={cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <ThemedText style={[styles.label, { color: colors.primaryContrast }]}>Total Spent</ThemedText>
            <ThemedText style={[styles.amount, { color: colors.primaryContrast }]}>
                Rs. {spent.toLocaleString()}
            </ThemedText>

            <View style={styles.progressContainer}>
                {/* Semi-transparent track using the contrast color */}
                <View style={[styles.progressBar, { backgroundColor: colors.primaryContrast + '40' }]}>
                    {/* Solid contrast color for the fill */}
                    <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.primaryContrast }]} />
                </View>
            </View>

            <View style={styles.footer}>
                <View>
                    <ThemedText style={[styles.footerLabel, { color: colors.primaryContrast + 'B3' }]}>Budget</ThemedText>
                    <ThemedText style={[styles.footerValue, { color: colors.primaryContrast }]}>
                        Rs. {total.toLocaleString()}
                    </ThemedText>
                </View>
                <View style={styles.footerRight}>
                    <ThemedText style={[styles.footerLabel, { color: colors.primaryContrast + 'B3' }]}>Left</ThemedText>
                    <ThemedText style={[styles.footerValue, { color: colors.primaryContrast }]}>
                        Rs. {left.toLocaleString()}
                    </ThemedText>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 10,
        marginHorizontal: 24,
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        opacity: 0.9,
    },
    amount: {
        fontSize: 40,
        fontWeight: "800",
        marginTop: 8,
        letterSpacing: -0.5,
        lineHeight: 48, // Ensure enough vertical space for the font
        includeFontPadding: false, // Fix Android clipping
    },
    progressContainer: {
        width: "100%",
        marginTop: 24,
        marginBottom: 8,
    },
    progressBar: {
        height: 12,
        borderRadius: 6,
        width: "100%",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 6,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
    footerLabel: {
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 2,
    },
    footerValue: {
        fontSize: 14,
        fontWeight: "700",
    },
    footerRight: {
        alignItems: "flex-end",
    },
});
