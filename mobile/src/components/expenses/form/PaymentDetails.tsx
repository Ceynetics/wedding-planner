import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { DatePicker } from '@/components/DatePicker';

interface PaymentDetailsProps {
    amount: string;
    onAmountChange: (value: string) => void;
    title: string;
    onTitleChange: (value: string) => void;
    amountError?: string;
    titleError?: string;
}

export function PaymentDetails({
    amount,
    onAmountChange,
    title,
    onTitleChange,
    amountError,
    titleError,
}: PaymentDetailsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const labelStyle = {
        color: colors.emphasis,
        fontSize: 18,
        fontWeight: '700' as const,
        marginBottom: 12,
        opacity: 1
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={[styles.sectionLabel, { color: colors.emphasis }]}>Payment Details</ThemedText>

            <TextField
                label="Amount"
                placeholder="0.00"
                value={amount}
                onChangeText={onAmountChange}
                keyboardType="decimal-pad"
                error={amountError}
                labelStyle={labelStyle}
                leftIcon={<ThemedText style={{ color: colors.secondary, fontWeight: '700', fontSize: 16 }}>Rs.</ThemedText>}
                containerStyle={styles.inputSpacing}
            />

            <TextField
                label="Expense Title"
                placeholder="e.g: Catering deposit"
                value={title}
                onChangeText={onTitleChange}
                error={titleError}
                leftIcon={<Ionicons name="receipt-outline" size={20} color={colors.placeholder} />}
                labelStyle={labelStyle}
                containerStyle={styles.inputSpacing}
            />

            <View style={styles.inputSpacing}>
                <ThemedText style={labelStyle}>Due Date</ThemedText>
                <TouchableOpacity
                    style={[styles.dateSelector, { backgroundColor: colors.inputBackground }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Ionicons name="calendar" size={20} color={colors.placeholder} style={styles.dateIcon} />
                    <ThemedText style={{ color: colors.text }}>{formatDate(selectedDate)}</ThemedText>
                </TouchableOpacity>
            </View>

            <DatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                value={selectedDate}
                onChange={setSelectedDate}
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
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 24,
    },
    inputSpacing: {
        marginBottom: 20,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    dateIcon: {
        marginRight: 12,
    },
});
