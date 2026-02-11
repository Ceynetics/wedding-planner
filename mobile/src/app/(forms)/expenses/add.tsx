import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Stack } from 'expo-router';
import { AddExpenseHeader } from '@/components/expenses/form/AddExpenseHeader';
import { PaymentDetails } from '@/components/expenses/form/PaymentDetails';
import { CategorySelector } from '@/components/expenses/form/CategorySelector';
import { PayerSplit } from '@/components/expenses/form/PayerSplit';
import { ExpenseNotes } from '@/components/expenses/form/ExpenseNotes';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function AddExpenseScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [amount, setAmount] = useState('40,000.00');
    const [chosenCategory, setChosenCategory] = useState('Food');
    const [splitEnabled, setSplitEnabled] = useState(false);
    const [paidBy, setPaidBy] = useState<'Me' | 'Partner'>('Me');
    const [notes, setNotes] = useState('');

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddExpenseHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Payment Details Section */}
                <PaymentDetails amount={amount} />

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

                {/* Notes Section */}
                <ExpenseNotes notes={notes} onNotesChange={setNotes} />

                <PrimaryButton
                    title="Add Expense"
                    onPress={() => { }}
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
});
