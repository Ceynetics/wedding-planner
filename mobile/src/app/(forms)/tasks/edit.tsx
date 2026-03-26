import { AddTaskHeader } from "@/components/tasks/form/AddTaskHeader";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
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

export default function EditTaskScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const { id } = useLocalSearchParams();

    // Form State (Mocked editing state based on ID passed in)
    const [taskName, setTaskName] = useState("Book Hotel");
    const [dueDate, setDueDate] = useState<Date | null>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [category, setCategory] = useState<"Venue" | "Food" | "Attire" | "Flowers">("Venue");
    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
    const [isCompleted, setIsCompleted] = useState(false);
    const [notes, setNotes] = useState("We need to confirm the venue booking.");

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleUpdateTask = () => {
        console.log("Updating Task ID: ", id, {
            taskName,
            dueDate,
            category,
            priority,
            isCompleted,
            notes
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Using the same generic header */}
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

                <PrimaryButton
                    title="Update Task"
                    onPress={handleUpdateTask}
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
