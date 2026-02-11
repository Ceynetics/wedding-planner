import { AddTaskHeader } from "@/components/tasks/form/AddTaskHeader";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { TextField } from "@/components/TextField";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function AddTaskScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
    const [isCompleted, setIsCompleted] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddTaskHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Task Name Section */}
                <View style={styles.section}>
                    <TextField
                        label="Task Name"
                        placeholder="What needs to be Done ?"
                    />
                </View>

                {/* Task Details Card */}
                <View style={styles.section}>
                    <ThemedText type="label" style={styles.sectionLabel}>Task Details</ThemedText>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        <TouchableOpacity style={styles.cardItem}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                                <Ionicons name="calendar-outline" size={20} color={colors.text} />
                            </View>
                            <ThemedText style={styles.cardItemText}>Due Date</ThemedText>
                            <Ionicons name="chevron-forward" size={20} color={colors.placeholder} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Priority Selector Card */}
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
                                    onPress={() => setPriority(p)}
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

                {/* Assign To Card */}
                <View style={styles.section}>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                                <Ionicons name="person-add-outline" size={20} color={colors.text} />
                            </View>
                            <ThemedText style={styles.cardItemText}>Assign To</ThemedText>
                        </View>
                        <View style={styles.avatarContainer}>
                            {[1, 2, 3].map((i) => (
                                <Image
                                    key={i}
                                    source={{ uri: `https://i.pravatar.cc/150?u=${i + 10}` }}
                                    style={styles.avatar}
                                />
                            ))}
                            <TouchableOpacity style={[styles.addAvatar, { borderColor: colors.primary + "40" }]}>
                                <Ionicons name="add" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Switches Card */}
                <View style={styles.section}>
                    <View style={[styles.card, { backgroundColor: colors.card, paddingVertical: 12 }]}>
                        <View style={styles.switchRow}>
                            <View style={styles.switchTextContainer}>
                                <ThemedText type="defaultSemiBold" style={{ color: colors.emphasis }}>Mark as Completed</ThemedText>
                                <ThemedText style={[styles.switchSubtitle, { color: colors.placeholder }]}>Task is already done</ThemedText>
                            </View>
                            <Switch
                                value={isCompleted}
                                onValueChange={setIsCompleted}
                                trackColor={{ false: colors.inputBackground, true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.switchRow}>
                            <View style={styles.switchTextContainer}>
                                <ThemedText type="defaultSemiBold" style={{ color: colors.emphasis }}>Mark as Private Task</ThemedText>
                                <ThemedText style={[styles.switchSubtitle, { color: colors.placeholder }]}>Your Partner won't see this task</ThemedText>
                            </View>
                            <Switch
                                value={isPrivate}
                                onValueChange={setIsPrivate}
                                trackColor={{ false: colors.inputBackground, true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                </View>

                {/* Additional Notes */}
                <View style={styles.section}>
                    <TextField
                        label="Additional Notes (Optional)"
                        placeholder="Add more Details If Needed"
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                    />
                </View>

                <PrimaryButton
                    title="Save Task"
                    onPress={() => { }}
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
    section: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 16,
        marginBottom: 12,
        fontWeight: "700",
    },
    input: {
        height: 60,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
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
    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
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
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    addAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1.5,
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    switchTextContainer: {
        flex: 1,
    },
    switchSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginVertical: 4,
        marginHorizontal: 16,
        opacity: 0.5,
    },
    saveButton: {
        marginTop: 10,
        borderRadius: 16,
        height: 60,
    },
});

