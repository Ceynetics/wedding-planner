import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '@/components/TextField';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { DatePicker } from '@/components/DatePicker';

interface TaskDetailsSectionProps {
    name: string;
    onNameChange: (text: string) => void;
    dueDate: Date | null;
    showDatePicker: boolean;
    onToggleDatePicker: (show: boolean) => void;
    onDateChange: (date: Date) => void;
    formatDate: (date: Date) => string;
}

export function TaskDetailsSection({
    name,
    onNameChange,
    dueDate,
    showDatePicker,
    onToggleDatePicker,
    onDateChange,
    formatDate
}: TaskDetailsSectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const labelStyle = {
        color: colors.emphasis,
        fontSize: 18,
        fontWeight: "700" as const,
        marginBottom: 12,
        opacity: 1
    };

    return (
        <View>
            <View style={styles.section}>
                <TextField
                    label="Task Name"
                    placeholder="What needs to be Done ?"
                    value={name}
                    onChangeText={onNameChange}
                    labelStyle={labelStyle}
                />
            </View>

            <View style={styles.section}>
                <ThemedText style={labelStyle}>Task Details</ThemedText>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => onToggleDatePicker(true)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                            <Ionicons name="calendar-outline" size={20} color={colors.text} />
                        </View>
                        <ThemedText style={styles.cardItemText}>
                            {dueDate ? formatDate(dueDate) : "Due Date"}
                        </ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={colors.placeholder} />
                    </TouchableOpacity>
                </View>

                <DatePicker
                    visible={showDatePicker}
                    onClose={() => onToggleDatePicker(false)}
                    value={dueDate || new Date()}
                    onChange={(date) => {
                        onDateChange(date);
                        onToggleDatePicker(false);
                    }}
                />
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
    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
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
});
