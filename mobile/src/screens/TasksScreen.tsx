import { Task, TaskCard } from "@/components/tasks/TaskCard";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useTasks } from "@/hooks/useTasks";
import { displayEnum } from "@/utils/enums";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksScreen() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const { tasks: apiTasks, isLoading, fetchTasks, toggleTask, deleteTask } = useTasks();

    const [status, setStatus] = useState<"completed" | "remaining">("remaining");
    const [searchQuery, setSearchQuery] = useState("");

    const mappedTasks: Task[] = apiTasks.map(t => ({
        id: String(t.id),
        title: t.title,
        priority: displayEnum(t.priority) as "High" | "Medium" | "Low",
        category: displayEnum(t.category) || 'Venue',
        date: t.dueDate || '',
        reminder: t.dueDate ? `Due ${t.dueDate}` : '',
        assignedUsers: t.assignedUsers?.map(u => u.avatarUrl || `https://i.pravatar.cc/150?u=${u.id}`) || [],
        isCompleted: t.isCompleted,
    }));

    const handleToggleTask = async (taskId: string) => {
        await toggleTask(Number(taskId));
    };

    const handleRemoveTask = async (taskId: string) => {
        await deleteTask(Number(taskId));
    };

    const filteredTasks = mappedTasks.filter(task => {
        const matchesStatus = status === "completed" ? task.isCompleted : !task.isCompleted;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            {/* Fixed Header and Filter Section */}
            <View style={styles.fixedSection}>
                <TaskHeader remainingTasks={mappedTasks.filter(t => !t.isCompleted).length} />
                <View style={styles.filtersWrapper}>
                    <TaskFilters
                        status={status}
                        setStatus={setStatus}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onFilterPress={() => console.log("Filter pressed")}
                    />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Tasks List */}
                <View style={styles.taskListContainer}>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onPress={() => console.log("Task pressed:", task.id)}
                                onCheckPress={() => handleToggleTask(task.id)}
                                onEditPress={() => router.push({ pathname: "/(forms)/tasks/edit", params: { id: task.id } as any })}
                                onRemovePress={() => handleRemoveTask(task.id)}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Image
                                source={require("@/../assets/images/Empty-bro.png")}
                                style={styles.emptyImage}
                                contentFit="contain"
                            />
                            <ThemedText style={styles.emptyTitle} type="subtitle">
                                {status === "completed" ? "No completed tasks" : "No tasks remaining"}
                            </ThemedText>
                            <ThemedText style={styles.emptySubtitle}>
                                {status === "completed"
                                    ? "Finish some tasks to see them here!"
                                    : "You're all caught up! Take a break."}
                            </ThemedText>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.emphasis }]}
                activeOpacity={0.8}
                onPress={() => router.push("/(forms)/tasks/add")}
            >
                <Ionicons name="add-outline" size={32} color={colors.primaryContrast} />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixedSection: {
        zIndex: 10,
        paddingBottom: 20,
    },
    filtersWrapper: {
        marginTop: 20, // Lower the filter section slightly
    },
    scrollContent: {
        paddingBottom: 120, // Extra padding for FAB
        paddingTop: 10,
    },
    taskListContainer: {
        marginTop: 10,
        gap: 8,
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        // Premium shadow for FAB
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 5,
        opacity: 0.9, // reduce opacity
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.6,
        lineHeight: 22,
    },
});
