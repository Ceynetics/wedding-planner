import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface TaskPrioritySectionProps {
    priority: "High" | "Medium" | "Low";
    onPriorityChange: (priority: "High" | "Medium" | "Low") => void;
}

export function TaskPrioritySection({ priority, onPriorityChange }: TaskPrioritySectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                        <Ionicons name="bar-chart-outline" size={20} color={colors.text} />
                    </View>
                    <ThemedText style={styles.cardItemText}>Priority</ThemedText>
                </View>
                <View style={styles.priorityContainer}>
                    {(["High", "Medium", "Low"] as const).map((p) => (
                        <TouchableOpacity
                            key={p}
                            onPress={() => onPriorityChange(p)}
                            style={[
                                styles.priorityButton,
                                { backgroundColor: colors.inputBackground },
                                priority === p && { backgroundColor: colors.primary },
                            ]}
                        >
                            <ThemedText
                                style={[
                                    styles.priorityButtonText,
                                    { color: colors.placeholder },
                                    priority === p && { color: "#FFFFFF" },
                                ]}
                            >
                                {p}
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
    priorityContainer: {
        flexDirection: "row",
        gap: 8,
    },
    priorityButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    priorityButtonText: {
        fontWeight: "700",
    },
});
