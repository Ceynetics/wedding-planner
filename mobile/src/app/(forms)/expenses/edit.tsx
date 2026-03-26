import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Switch,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { AddExpenseHeader } from '@/components/expenses/form/AddExpenseHeader';
import { PaymentDetails } from '@/components/expenses/form/PaymentDetails';
import { CategorySelector } from '@/components/expenses/form/CategorySelector';
import { PayerSplit } from '@/components/expenses/form/PayerSplit';
import { ExpenseNotes } from '@/components/expenses/form/ExpenseNotes';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function EditExpenseScreen() {
    // --- Setup Context Hooks ---
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    
    // Safely capture payload from navigating element
    const { id } = useLocalSearchParams();

    // --- State Management ---
    // Pre-populate utilizing mocked fetch response states mapped via `{id}`
    const [amount, setAmount] = useState('500,000.00'); // Seed dummy edit data
    const [chosenCategory, setChosenCategory] = useState('Clothing');
    const [splitEnabled, setSplitEnabled] = useState(false);
    const [paidBy, setPaidBy] = useState<'Me' | 'Partner'>('Partner');
    const [notes, setNotes] = useState('Bridal designer fee installment');
    const [isPaid, setIsPaid] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header repurposed utilizing parameterized title */}
            <AddExpenseHeader title="Edit Expense" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* 1. Payment Details Section */}
                <PaymentDetails amount={amount} />

                {/* 2. Choose Payment Category Section */}
                <CategorySelector
                    chosenCategory={chosenCategory}
                    onSelectCategory={setChosenCategory}
                />

                {/* 3. Payer & Split Section */}
                <PayerSplit
                    paidBy={paidBy}
                    onPaidByChange={setPaidBy}
                    splitEnabled={splitEnabled}
                    onSplitChange={setSplitEnabled}
                />

                {/* 4. Resolved Payment Verification Toggle */}
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

                {/* 5. Supplemental Data Section */}
                <ExpenseNotes notes={notes} onNotesChange={setNotes} />

                {/* 6. Form Submission Trigger */}
                <PrimaryButton
                    title="Update Expense"
                    onPress={() => {
                        console.log('Update expense payload fired:', { id, amount, isPaid, notes });
                    }}
                    style={styles.saveButton}
                    icon="save-outline"
                />
            </ScrollView>
        </View>
    );
}

// Ensure style constraints remain strictly detached targeting performance tracking optimizations
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
