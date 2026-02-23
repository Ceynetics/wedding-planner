import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface NotesAndReminderProps {
    notes: string;
    onNotesChange: (text: string) => void;
    reminderEnabled: boolean;
    onReminderChange: (enabled: boolean) => void;
}

export function NotesAndReminder({
    notes,
    onNotesChange,
    reminderEnabled,
    onReminderChange,
}: NotesAndReminderProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const switchTrackColor = {
        false: theme === 'dark' ? colors.secondary : colors.border,
        true: colors.primary
    };

    return (
        <View style={styles.container}>
            {/* Notes Section */}
            <View style={styles.notesSection}>
                <TextField
                    label="Notes (Optional)"
                    placeholder="Add more Details If Needed"
                    value={notes}
                    onChangeText={onNotesChange}
                    multiline
                    numberOfLines={4}
                    containerStyle={styles.notesInput}
                    /* Using 'background' and 'border' for clear separation from the card container */
                    inputContainerStyle={[
                        styles.textAreaContainer,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.border
                        }
                    ]}
                    style={[styles.textArea, { color: colors.text }]}
                />
            </View>

            {/* Payment Reminder Section */}
            <View style={styles.reminderSection}>
                <View style={styles.reminderContent}>
                    <ThemedText style={[styles.reminderTitle, { color: colors.emphasis }]}>
                        Payment Reminder
                    </ThemedText>
                    <ThemedText style={[styles.reminderSubtitle, { color: colors.secondary }]}>
                        Reminds 5 days before due date
                    </ThemedText>
                </View>
                <Switch
                    value={reminderEnabled}
                    onValueChange={onReminderChange}
                    trackColor={switchTrackColor}
                    thumbColor={colors.primaryContrast}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    notesSection: {
        marginBottom: 20,
    },
    notesInput: {
        marginBottom: 0,
    },
    textAreaContainer: {
        minHeight: 160,
        alignItems: 'flex-start',
        borderWidth: 1, // Added border for better visibility
        borderRadius: 16, // Smoother corners for premium look
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    textArea: {
        textAlignVertical: 'top',
        fontSize: 16,
    },
    reminderSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    reminderContent: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    reminderSubtitle: {
        fontSize: 14,
        fontWeight: '500',
    },
});
