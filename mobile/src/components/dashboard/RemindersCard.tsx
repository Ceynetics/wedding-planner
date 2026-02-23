import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface RemindersCardProps {
    onPress?: () => void;
    mainReminder: string;
    alertCount: number;
    overdueCount: number;
}

export function RemindersCard({
    onPress,
    mainReminder,
    alertCount,
    overdueCount,
}: RemindersCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                    <Ionicons name="notifications" size={18} color={colors.primary} />
                </View>
                <ThemedText style={[styles.title, { color: colors.primary }]}>
                    Today's Reminders
                </ThemedText>
            </View>

            <ThemedText style={styles.description}>{mainReminder}</ThemedText>

            <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: colors.primary + "15" }]}>
                    <ThemedText style={[styles.badgeText, { color: colors.primary }]}>
                        {alertCount} New Alerts
                    </ThemedText>
                </View>

                <View style={[styles.badge, { backgroundColor: colors.error + "15" }]}>
                    <ThemedText style={[styles.badgeText, { color: colors.error }]}>
                        {overdueCount} Overdue
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        padding: 20,
        borderRadius: 24,
        // Premium floating effect
        // elevation: 4,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.05,
        // shadowRadius: 10,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
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
        fontSize: 17,
        fontWeight: "700",
    },
    description: {
        fontSize: 14,
        opacity: 0.6,
        marginLeft: 42,
        marginBottom: 16,
    },
    badgeContainer: {
        flexDirection: "row",
        gap: 10,
        marginLeft: 42,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "600",
    },
});
