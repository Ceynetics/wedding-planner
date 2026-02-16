import { AddTaskHeader } from "@/components/tasks/form/AddTaskHeader";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TaskDetailsSection } from "@/components/tasks/form/TaskDetailsSection";
import { TaskPrioritySection } from "@/components/tasks/form/TaskPrioritySection";
import { TaskAssignmentSection } from "@/components/tasks/form/TaskAssignmentSection";
import { TaskSettingsSection } from "@/components/tasks/form/TaskSettingsSection";
import { TaskNotesSection } from "@/components/tasks/form/TaskNotesSection";

export default function AddTaskScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    // Form State
    const [taskName, setTaskName] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
    const [isCompleted, setIsCompleted] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [notes, setNotes] = useState("");

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleSaveTask = () => {
        console.log("Saving Task:", {
            taskName,
            dueDate,
            priority,
            isCompleted,
            isPrivate,
            notes
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddTaskHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TaskDetailsSection
                    name={taskName}
                    onNameChange={setTaskName}
                    dueDate={dueDate}
                    showDatePicker={showDatePicker}
                    onToggleDatePicker={setShowDatePicker}
                    onDateChange={setDueDate}
                    formatDate={formatDate}
                />

                <TaskPrioritySection
                    priority={priority}
                    onPriorityChange={setPriority}
                />

                <TaskAssignmentSection />

                <TaskSettingsSection
                    isCompleted={isCompleted}
                    onCompletedChange={setIsCompleted}
                    isPrivate={isPrivate}
                    onPrivateChange={setIsPrivate}
                />

                <TaskNotesSection
                    notes={notes}
                    onNotesChange={setNotes}
                />

                <PrimaryButton
                    title="Save Task"
                    onPress={handleSaveTask}
                    style={styles.saveButton}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    saveButton: {
        marginTop: 10,
        borderRadius: 16,
        height: 60,
    },
});
