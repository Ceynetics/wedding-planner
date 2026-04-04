import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface TableNameInputProps {
    tableName: string;
    onTableNameChange: (text: string) => void;
    error?: string;
}

export function TableNameInput({
    tableName,
    onTableNameChange,
    error: errorProp,
}: TableNameInputProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <ThemedText style={[styles.label, { color: colors.emphasis }]}>Table Name</ThemedText>
            <TextField
                placeholder="Example Table"
                value={tableName}
                onChangeText={onTableNameChange}
                error={errorProp}
                containerStyle={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    input: {
        marginBottom: 0,
    },
});
