import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

interface StepperProps {
    value: number;
    onValueChange: (value: number) => void;
    label: string;
}

export function Stepper({ value, onValueChange, label }: StepperProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const increment = () => onValueChange(value + 1);
    const decrement = () => onValueChange(Math.max(0, value - 1));

    return (
        <View style={styles.container}>
            <ThemedText style={[styles.label, { color: colors.emphasis }]}>{label}</ThemedText>
            <View style={[styles.stepperContainer, { backgroundColor: colors.inputBackground }]}>
                <TouchableOpacity onPress={decrement} style={styles.button}>
                    <Ionicons name="remove" size={20} color={colors.emphasis} />
                </TouchableOpacity>
                <ThemedText style={[styles.value, { color: colors.emphasis }]}>{value}</ThemedText>
                <TouchableOpacity onPress={increment} style={styles.button}>
                    <Ionicons name="add" size={20} color={colors.emphasis} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 8,
    },
    button: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
