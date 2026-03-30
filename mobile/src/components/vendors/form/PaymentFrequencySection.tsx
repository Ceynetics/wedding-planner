import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

/**
 * Payment Frequency Options
 */
export type PaymentFrequency = "One-time" | "Weekly" | "Monthly" | "Milestone";

/**
 * Mapping of Frequencies to their respective icons
 */
const ICONS: Record<PaymentFrequency, keyof typeof MaterialCommunityIcons.glyphMap> = {
    "One-time": "cash-check",
    Weekly: "calendar-week",
    Monthly: "calendar-month",
    Milestone: "flag-checkered",
};

/**
 * Available frequencies for Vendor selection
 */
const FREQUENCIES: PaymentFrequency[] = ["One-time", "Weekly", "Monthly", "Milestone"];

interface PaymentFrequencySectionProps {
    frequency: PaymentFrequency;
    onFrequencyChange: (frequency: PaymentFrequency) => void;
}

/**
 * A responsive selection section for Payment Frequency in the Vendor form.
 * Uses a grid layout with Material icons and theme-aware styling.
 */
export function PaymentFrequencySection({ frequency, onFrequencyChange }: PaymentFrequencySectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                {/* Section Header */}
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color={colors.text} />
                    </View>
                    <ThemedText style={styles.cardItemText}>Payment Frequency</ThemedText>
                </View>

                {/* Frequency Grid */}
                <View style={styles.frequencyContainer}>
                    {FREQUENCIES.map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => onFrequencyChange(f)}
                            style={[
                                styles.freqButton,
                                { 
                                    backgroundColor: colors.background,
                                    borderWidth: 1,
                                    borderColor: colors.border
                                },
                                frequency === f && { 
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary
                                },
                            ]}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name={ICONS[f]}
                                size={22}
                                color={frequency === f ? colors.primaryContrast : colors.secondary}
                            />
                            <ThemedText
                                style={[
                                    styles.freqButtonText,
                                    { color: colors.secondary },
                                    frequency === f && { color: colors.primaryContrast },
                                ]}
                            >
                                {f}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    cardItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
    },
    frequencyContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    freqButton: {
        flex: 1,
        minWidth: "45%",
        height: 56, // Matched with VendorCategorySection for consistency
        borderRadius: 14,
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
        marginBottom: 4,
    },
    freqButtonText: {
        fontSize: 14,
        fontWeight: "700",
    },
});
