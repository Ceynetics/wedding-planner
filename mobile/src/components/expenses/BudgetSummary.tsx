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

    // Deep purple gradient for the budget card to match the premium design
    const cardGradient = (theme === 'light'
        ? [colors.primary, '#4F46E5'] // Rich Indigo/Purple
        : ['#4338CA', '#312E81']) as [string, string, ...string[]];

    return (
        <LinearGradient
            colors={cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <ThemedText style={styles.label} darkColor="#FFFFFF" lightColor="#FFFFFF">Total Spent</ThemedText>
            <ThemedText style={styles.amount} darkColor="#FFFFFF" lightColor="#FFFFFF">
                Rs. {spent.toLocaleString()}
            </ThemedText>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: '#FFFFFF' }]} />
                </View>
            </View>

            <View style={styles.footer}>
                <View>
                    <ThemedText style={styles.footerLabel} darkColor="#FFFFFFB3" lightColor="#FFFFFFB3">Budget</ThemedText>
                    <ThemedText style={styles.footerValue} darkColor="#FFFFFF" lightColor="#FFFFFF">
                        Rs. {total.toLocaleString()}
                    </ThemedText>
                </View>
                <View style={styles.footerRight}>
                    <ThemedText style={styles.footerLabel} darkColor="#FFFFFFB3" lightColor="#FFFFFFB3">Left</ThemedText>
                    <ThemedText style={styles.footerValue} darkColor="#FFFFFF" lightColor="#FFFFFF">
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
