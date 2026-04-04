import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Switch,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { AddExpenseHeader } from '@/components/expenses/form/AddExpenseHeader';
import { PaymentDetails } from '@/components/expenses/form/PaymentDetails';
import { CategorySelector } from '@/components/expenses/form/CategorySelector';
import { PayerSplit } from '@/components/expenses/form/PayerSplit';
import { ExpenseNotes } from '@/components/expenses/form/ExpenseNotes';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useExpenses } from '@/hooks/useExpenses';
import { extractErrorMessage } from '@/utils/errors';
import { required, positiveNumber } from '@/utils/validation';
import type { ExpenseCategory, Payer } from '@/types/api';

export default function AddExpenseScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { createExpense } = useExpenses();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [chosenCategory, setChosenCategory] = useState('Food');
    const [splitEnabled, setSplitEnabled] = useState(false);
    const [paidBy, setPaidBy] = useState<'Me' | 'Partner'>('Me');
    const [notes, setNotes] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: { title?: string; amount?: string } = {};
        newErrors.title = required(title, 'Expense title');
        newErrors.amount = positiveNumber(amount, 'Amount');
        const hasErrors = Object.values(newErrors).some(Boolean);
        setErrors(hasErrors ? newErrors : {});
        return !hasErrors;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddExpenseHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Payment Details Section */}
                <PaymentDetails
                    amount={amount}
                    onAmountChange={(v) => { setAmount(v); setErrors(prev => ({ ...prev, amount: undefined })); }}
                    title={title}
                    onTitleChange={(v) => { setTitle(v); setErrors(prev => ({ ...prev, title: undefined })); }}
                    amountError={errors.amount}
                    titleError={errors.title}
                />

                {/* Choose Payment Category Section */}
                <CategorySelector
                    chosenCategory={chosenCategory}
                    onSelectCategory={setChosenCategory}
                />

                {/* Payer & Split Section */}
                <PayerSplit
                    paidBy={paidBy}
                    onPaidByChange={setPaidBy}
                    splitEnabled={splitEnabled}
                    onSplitChange={setSplitEnabled}
                />

                {/* Already Paid Toggle Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleTextContainer}>
                            <ThemedText style={styles.toggleTitle}>Already Paid</ThemedText>
                            <ThemedText style={[styles.toggleSubtitle, { color: colors.secondary }]}>
                                Mark this expense as permanently settled
                            </ThemedText>
                        </View>
                        <Switch
                            value={isPaid}
                            onValueChange={setIsPaid}
                            trackColor={{ false: theme === 'light' ? '#E2E8F0' : '#334155', true: colors.primary }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor={theme === 'light' ? '#E2E8F0' : '#334155'}
                        />
                    </View>
                </View>

                {/* Notes Section */}
                <ExpenseNotes notes={notes} onNotesChange={setNotes} />

                {error ? <ThemedText style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</ThemedText> : null}

                <PrimaryButton
                    title="Add Expense"
                    onPress={async () => {
                        if (!validateForm()) return;
                        setLoading(true);
                        setError('');
                        try {
                            await createExpense({
                                title,
                                amount: parseFloat(amount.replace(/,/g, '')) || 0,
                                category: chosenCategory.toUpperCase() as ExpenseCategory,
                                paidBy: (paidBy === 'Me' ? 'ME' : 'PARTNER') as Payer,
                                isPaid,
                                splitEnabled,
                                notes: notes || undefined,
                            });
                            router.back();
                        } catch (e) {
                            setError(extractErrorMessage(e));
                        } finally {
                            setLoading(false);
                        }
                    }}
                    loading={loading}
                    style={styles.saveButton}
                    icon="add-circle-outline"
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
        paddingTop: 10,
        paddingBottom: 40,
    },
    saveButton: {
        marginTop: 10,
        height: 60,
        borderRadius: 16,
    },
    card: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleTextContainer: {
        flex: 1,
        paddingRight: 16,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    toggleSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.8,
    },
});
