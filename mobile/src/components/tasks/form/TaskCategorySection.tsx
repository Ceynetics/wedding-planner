import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

export type TaskCategory = "Venue" | "Food" | "Attire" | "Flowers";

const ICONS: Record<TaskCategory, any> = {
    Venue: require("@/../assets/icons/venue.png"),
    Food: require("@/../assets/icons/food.png"),
    Attire: require("@/../assets/icons/attire.png"),
    Flowers: require("@/../assets/icons/floral.png"),
};

interface TaskCategorySectionProps {
    category: TaskCategory;
    onCategoryChange: (category: TaskCategory) => void;
}

const CATEGORIES: TaskCategory[] = ["Venue", "Food", "Attire", "Flowers"];

export function TaskCategorySection({ category, onCategoryChange }: TaskCategorySectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                        <Ionicons name="grid-outline" size={20} color={colors.text} />
                    </View>
                    <ThemedText style={styles.cardItemText}>Category</ThemedText>
                </View>
                <View style={styles.categoryContainer}>
                    {CATEGORIES.map((c) => (
                        <TouchableOpacity
                            key={c}
                            onPress={() => onCategoryChange(c)}
                            style={[
                                styles.categoryButton,
                                { backgroundColor: colors.inputBackground },
                                category === c && { backgroundColor: colors.primary },
                            ]}
                        >
                            <Image
                                source={ICONS[c]}
                                style={styles.categoryIcon}
                                contentFit="contain"
                            />
                            <ThemedText
                                style={[
                                    styles.categoryButtonText,
                                    { color: colors.placeholder },
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
        borderRadius: 20,
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
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    cardItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    categoryButton: {
        flex: 1,
        minWidth: "45%",
        height: 52,
        borderRadius: 12,
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryIcon: {
        width: 30,
        height: 30,
    },
    categoryButtonText: {
        fontWeight: "700",
    },
});
