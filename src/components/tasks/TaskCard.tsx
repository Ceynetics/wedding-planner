import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export interface Task {
    id: string;
    title: string;
    priority: "High" | "Medium" | "Low";
    category: string;
    date: string;
    reminder: string;
    assignedUsers: string[];
}

interface TaskCardProps {
    task: Task;
    onPress?: () => void;
    onCheckPress?: () => void;
    onMorePress?: () => void;
}

export function TaskCard({ task, onPress, onCheckPress, onMorePress }: TaskCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const getPriorityColor = () => {
        switch (task.priority) {
            case "High": return colors.error;
            case "Medium": return colors.warning;
            case "Low": return colors.success;
            default: return colors.primary;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Top Row: Checkbox, Title, More */}
            <View style={styles.topRow}>
                <View style={styles.leftSection}>
                    <TouchableOpacity
                        style={[styles.checkCircle, { borderColor: colors.secondary + "40" }]}
                        onPress={onCheckPress}
                    />
                    <ThemedText style={styles.title}>{task.title}</ThemedText>
                </View>
                <TouchableOpacity onPress={onMorePress}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.secondary} />
                </TouchableOpacity>
            </View>

            {/* Middle Row: Priority Badge, Category */}
            <View style={styles.middleRow}>
                <View style={[styles.priorityPill, { backgroundColor: getPriorityColor() + "15" }]}>
                    <ThemedText style={[styles.priorityText, { color: getPriorityColor() }]}>
                        {task.priority}
                    </ThemedText>
                </View>
                <View style={[styles.separator, { backgroundColor: colors.secondary + "40" }]} />
                <ThemedText style={styles.categoryText}>{task.category}</ThemedText>
            </View>

            {/* Bottom Row: Date, Reminder, Avatars */}
            <View style={styles.bottomRow}>
                <View style={styles.infoGroup}>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={16} color={colors.secondary} />
                        <ThemedText style={styles.infoText}>{task.date}</ThemedText>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="notifications-outline" size={16} color={colors.error} />
                        <ThemedText style={[styles.infoText, { color: colors.error }]}>
                            {task.reminder}
                        </ThemedText>
                    </View>
                </View>

                {/* Avatar Stack */}
                <View style={styles.avatarStack}>
                    {task.assignedUsers.map((url, index) => (
                        <Image
                            key={index}
                            source={{ uri: url }}
                            style={[
                                styles.avatar,
                                {
                                    borderColor: colors.card,
                                    marginLeft: index === 0 ? 0 : -10,
                                    zIndex: 10 - index,
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 24,
        marginVertical: 8,
        padding: 20,
        borderRadius: 24,
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    middleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
        paddingLeft: 36, // Align with title
    },
    priorityPill: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: "700",
    },
    separator: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    categoryText: {
        fontSize: 14,
        opacity: 0.6,
        fontWeight: "500",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 36, // Align with title
    },
    infoGroup: {
        flexDirection: "row",
        gap: 16,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    infoText: {
        fontSize: 13,
        fontWeight: "600",
        opacity: 0.6,
    },
    avatarStack: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
    },
});
