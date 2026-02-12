import { Task, TaskCard } from "@/components/tasks/TaskCard";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function TasksScreen() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [status, setStatus] = useState<"completed" | "remaining">("remaining");
    const [searchQuery, setSearchQuery] = useState("");

    const dummyTasks: Task[] = [
        {
            id: "1",
            title: "Book Hotel",
            priority: "High",
            category: "Venue",
            date: "June 24",
            reminder: "1 more day",
            assignedUsers: [
                "https://i.pravatar.cc/150?u=1",
                "https://i.pravatar.cc/150?u=2",
                "https://i.pravatar.cc/150?u=3",
            ],
        },
        {
            id: "2",
            title: "Book Hotel",
            priority: "High",
            category: "Venue",
            date: "June 24",
            reminder: "1 more day",
            assignedUsers: [
                "https://i.pravatar.cc/150?u=4",
                "https://i.pravatar.cc/150?u=5",
                "https://i.pravatar.cc/150?u=6",
            ],
        },
        {
            id: "3",
            title: "Book Hotel",
            priority: "High",
            category: "Venue",
            date: "June 24",
            reminder: "1 more day",
            assignedUsers: [
                "https://i.pravatar.cc/150?u=7",
                "https://i.pravatar.cc/150?u=8",
                "https://i.pravatar.cc/150?u=9",
            ],
        },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header Section */}
                <TaskHeader remainingTasks={12} />

                {/* Filter Section */}
                <TaskFilters
                    status={status}
                    setStatus={setStatus}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onFilterPress={() => console.log("Filter pressed")}
                />

                {/* Tasks List */}
                <View style={styles.taskListContainer}>
                    {dummyTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onPress={() => console.log("Task pressed:", task.id)}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: "#2D0C4D" }]}
                activeOpacity={0.8}
                onPress={() => router.push("/(forms)/tasks/add")}
            >
                <Ionicons name="add-outline" size={32} color="#FFFFFF" />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120, // Extra padding for FAB
    },
    taskListContainer: {
        marginTop: 20,
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
});
