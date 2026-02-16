import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

import { DatePicker } from '@/components/DatePicker';

interface PaymentScheduleProps {
    totalAmount: string;
    onTotalAmountChange: (text: string) => void;
    // For now, let's keep it simple as per screenshot. We might need a list of payments later.
}

export function PaymentSchedule({
    totalAmount,
    onTotalAmountChange,
}: PaymentScheduleProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    // Local state for the "Add Payment" inputs shown in the screenshot
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            {/* Section Header Name */}
            <ThemedText style={[styles.sectionHeader, { color: colors.emphasis }]}>Payment Schedule</ThemedText>

            {/* Total Contract Amount Card */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <ThemedText style={[styles.cardLabel, { color: colors.emphasis }]}>Total Contract Amount</ThemedText>
                <View style={styles.amountInputContainer}>
                    <ThemedText style={[styles.currencyPrefix, { color: colors.text }]}>Rs.</ThemedText>
                    <TextInput
                        placeholder="00.00"
                        value={totalAmount}
                        onChangeText={onTotalAmountChange}
                        keyboardType="numeric"
                        style={[styles.amountText, { color: colors.secondary }]}
                        placeholderTextColor={colors.placeholder}
                        scrollEnabled={false}
                        multiline={false}
                    />
                </View>
            </View>

            {/* Add Payment Inputs Row */}
            <View style={styles.row}>
                <TextField
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    leftIcon={<Ionicons name="wallet-outline" size={20} color={colors.secondary} />}
                    containerStyle={styles.halfInput}
                />
                <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: colors.inputBackground }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Ionicons name="calendar-outline" size={20} color={colors.secondary} style={styles.icon} />
                    <ThemedText style={[styles.dateText, { color: dueDate ? colors.text : colors.placeholder }]}>
                        {dueDate ? formatDate(dueDate) : "Due Date"}
                    </ThemedText>
                </TouchableOpacity>
            </View>

            <DatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                value={dueDate || new Date()}
                onChange={(date) => {
                    setDueDate(date);
                    setShowDatePicker(false);
                }}
            />

            {/* Add Payments Button */}
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.expensePurpleBg }]}
                onPress={() => { }}
            >
                <Ionicons name="cash-outline" size={24} color={colors.expensePurple} style={styles.addIcon} />
                <ThemedText style={[styles.addButtonText, { color: colors.expensePurple }]}>Add Payments</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    cardLabel: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyPrefix: {
        fontSize: 24,
        fontWeight: '700',
        marginRight: 8,
    },
    amountInputWrapper: {
        flex: 1,
        marginBottom: 0,
    },
    amountInput: {
        height: 40,
        minHeight: 0,
    },
    amountText: {
        fontSize: 24,
        fontWeight: '700',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    halfInput: {
        flex: 1,
        marginBottom: 0,
    },
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 56, // Match TextField height
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 10,
    },
    dateText: {
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 16,
        width: '100%',
    },
    addIcon: {
        marginRight: 8,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
