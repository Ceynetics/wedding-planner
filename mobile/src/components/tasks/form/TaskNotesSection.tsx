import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface TaskNotesSectionProps {
    notes: string;
    onNotesChange: (text: string) => void;
}

export function TaskNotesSection({ notes, onNotesChange }: TaskNotesSectionProps) {
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
        <View style={styles.section}>
            <TextField
                label="Additional Notes (Optional)"
                placeholder="Add more Details If Needed"
                value={notes}
                onChangeText={onNotesChange}
                multiline
                numberOfLines={4}
                style={styles.textArea}
                labelStyle={labelStyle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
});
