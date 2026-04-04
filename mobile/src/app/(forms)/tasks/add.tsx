import { AddTaskHeader } from "@/components/tasks/form/AddTaskHeader";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useTasks } from "@/hooks/useTasks";
import { extractErrorMessage } from "@/utils/errors";
import { required } from "@/utils/validation";
import type { TaskPriority, TaskCategory } from "@/types/api";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TaskDetailsSection } from "@/components/tasks/form/TaskDetailsSection";
import { TaskCategorySection } from "@/components/tasks/form/TaskCategorySection";
import { TaskPrioritySection } from "@/components/tasks/form/TaskPrioritySection";
import { TaskAssignmentSection } from "@/components/tasks/form/TaskAssignmentSection";
import { TaskSettingsSection } from "@/components/tasks/form/TaskSettingsSection";
import { TaskNotesSection } from "@/components/tasks/form/TaskNotesSection";

export default function AddTaskScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { createTask } = useTasks();

    // Form State
    const [taskName, setTaskName] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState<{ taskName?: string }>({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<"Venue" | "Food" | "Attire" | "Flowers">("Venue");
    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
    const [isCompleted, setIsCompleted] = useState(false);
    const [notes, setNotes] = useState("");

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const validateForm = (): boolean => {
        const newErrors: { taskName?: string } = {};
        newErrors.taskName = required(taskName, "Task name");
        const hasErrors = Object.values(newErrors).some(Boolean);
        setErrors(hasErrors ? newErrors : {});
        return !hasErrors;
    };

    const handleSaveTask = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setError("");
        try {
            await createTask({
                title: taskName,
                dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
                category: category.toUpperCase() as TaskCategory,
                priority: priority.toUpperCase() as TaskPriority,
                isCompleted,
                notes: notes || undefined,
            });
            router.back();
        } catch (e) {
            setError(extractErrorMessage(e));
        } finally {
            setLoading(false);
        }
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
                    onNameChange={(v) => { setTaskName(v); setErrors(prev => ({ ...prev, taskName: undefined })); }}
                    nameError={errors.taskName}
                    dueDate={dueDate}
                    showDatePicker={showDatePicker}
                    onToggleDatePicker={setShowDatePicker}
                    onDateChange={setDueDate}
                    formatDate={formatDate}
                />

                <TaskCategorySection
                    category={category}
                    onCategoryChange={setCategory}
                />

                <TaskPrioritySection
                    priority={priority}
                    onPriorityChange={setPriority}
                />

                <TaskAssignmentSection />

                <TaskSettingsSection
                    isCompleted={isCompleted}
                    onCompletedChange={setIsCompleted}
                />

                <TaskNotesSection
                    notes={notes}
                    onNotesChange={setNotes}
                />

                {error ? <ThemedText style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</ThemedText> : null}

                <PrimaryButton
                    title="Save Task"
                    onPress={handleSaveTask}
                    loading={loading}
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
