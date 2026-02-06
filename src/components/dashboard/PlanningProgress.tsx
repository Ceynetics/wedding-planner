import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface UpcomingTask {
    id: string;
    title: string;
    dueDate: string;
}

interface PlanningProgressProps {
    progress: number;
    upcomingTasks: UpcomingTask[];
}

export function PlanningProgress({
    progress,
    upcomingTasks,
}: PlanningProgressProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: colors.primary + "15" },
                        ]}
                    >
                        <Ionicons name="stats-chart" size={18} color={colors.primary} />
                    </View>
                    <ThemedText style={[styles.title, { color: colors.primary }]}>
                        Planning Progress
                    </ThemedText>
                </View>
                <ThemedText style={styles.percentageText}>{progress}%</ThemedText>
            </View>

            <View style={[styles.progressBarBg, { backgroundColor: colors.background }]}>
                <View
                    style={[
                        styles.progressBarFill,
                        { width: `${progress}%`, backgroundColor: colors.primary },
                    ]}
                />
            </View>

            <ThemedText style={styles.sectionLabel}>Upcoming Tasks</ThemedText>

            <View style={styles.taskList}>
                {upcomingTasks.map((task) => (
                    <View
                        key={task.id}
                        style={[
                            styles.taskItem,
                            { backgroundColor: colors.primary + "10" },
                        ]}
                    >
                        <View style={[styles.checkCircle, { borderColor: colors.primary + "40" }]} />
                        <View style={styles.taskContent}>
                            <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
                            <ThemedText style={[styles.taskDueDate, { color: colors.error }]}>
                                {task.dueDate}
                            </ThemedText>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 24,
        // Floating effect
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
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
    percentageText: {
        fontSize: 16,
        fontWeight: "600",
        opacity: 0.6,
    },
    progressBarBg: {
        height: 10,
        borderRadius: 5,
        overflow: "hidden",
        marginBottom: 24,
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 5,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "600",
        opacity: 0.5,
        marginBottom: 12,
    },
    taskList: {
        gap: 10,
    },
    taskItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 16,
        gap: 12,
    },
    checkCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        backgroundColor: "#fff",
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: "700",
    },
    taskDueDate: {
        fontSize: 11,
        fontWeight: "500",
        marginTop: 1,
    },
});
