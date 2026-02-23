import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface ExpenseNotesProps {
    notes: string;
    onNotesChange: (text: string) => void;
}

export function ExpenseNotes({ notes, onNotesChange }: ExpenseNotesProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const labelStyle = {
        color: colors.emphasis,
        fontSize: 18,
        fontWeight: '700' as const,
        marginBottom: 12,
        opacity: 1
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TextField
                label="Notes (Optional)"
                placeholder="Add more Details If Needed"
                value={notes}
                onChangeText={onNotesChange}
                multiline
                numberOfLines={4}
                labelStyle={labelStyle}
                style={[styles.textArea, { color: colors.text }]}
                /* Recessed container using 'background' for clear separation from the card */
                inputContainerStyle={[
                    styles.textAreaContainer,
                    {
                        backgroundColor: colors.background,
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    textAreaContainer: {
        marginTop: 10,
        minHeight: 150,
        alignItems: 'flex-start',
        paddingTop: 12,
    },
    textArea: {
        textAlignVertical: 'top',
        fontSize: 16,
    },
});
