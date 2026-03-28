import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

/**
 * Vendor Category Options
 */
export type VendorCategory = "Venue" | "Food" | "Attire" | "Flowers";

/**
 * Mapping of Categories to their respective asset icons
 */
const ICONS: Record<VendorCategory, any> = {
    Venue: require("@/../assets/icons/venue.png"),
    Food: require("@/../assets/icons/food.png"),
    Attire: require("@/../assets/icons/attire.png"),
    Flowers: require("@/../assets/icons/floral.png"),
};

/**
 * Available categories for Vendor selection
 */
const CATEGORIES: VendorCategory[] = ["Venue", "Food", "Attire", "Flowers"];

interface VendorCategorySectionProps {
    category: VendorCategory;
    onCategoryChange: (category: VendorCategory) => void;
}

/**
 * A responsive category selection section for the Vendor form.
 * Uses a grid-like layout with custom icons and theme-aware styling.
 */
export function VendorCategorySection({ category, onCategoryChange }: VendorCategorySectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                {/* Section Header */}
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                        <Ionicons name="grid-outline" size={20} color={colors.text} />
                    </View>
                    <ThemedText style={styles.cardItemText}>Category</ThemedText>
                </View>

                {/* Categories Grid */}
                <View style={styles.categoryContainer}>
                    {CATEGORIES.map((c) => (
                        <TouchableOpacity
                            key={c}
                            onPress={() => onCategoryChange(c)}
                            style={[
                                styles.categoryButton,
                                { 
                                    backgroundColor: colors.background,
                                    borderWidth: 1,
                                    borderColor: colors.border
                                },
                                category === c && { 
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary
                                },
                            ]}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={ICONS[c]}
                                style={styles.categoryIcon}
                                contentFit="contain"
                                transition={200}
                            />
                            <ThemedText
                                style={[
                                    styles.categoryButtonText,
                                    { color: colors.secondary },
                                    category === c && { color: "#FFFFFF" },
                                ]}
                            >
                                {c}
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
        borderRadius: 24, // Consistent with other form cards
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
        marginBottom: 20, // Increased gap for clarity
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
        fontWeight: "700", // Premium feel
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10, // Consistent spacing
    },
    categoryButton: {
        flex: 1,
        minWidth: "45%", // Responsive 2-column layout
        height: 56, // Slightly taller for better touch target
        borderRadius: 14,
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    categoryIcon: {
        width: 35,
        height: 35,
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: "700",
    },
});
