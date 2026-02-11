import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AddVendorHeader } from '@/components/vendors/form/AddVendorHeader';
import { VendorDetailsForm } from '@/components/vendors/form/VendorDetailsForm';
import { ContactInfoForm } from '@/components/vendors/form/ContactInfoForm';
import { PaymentSchedule } from '@/components/vendors/form/PaymentSchedule';
import { NotesAndReminder } from '@/components/vendors/form/NotesAndReminder';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';

export default function VendorAddScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [vendorName, setVendorName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [totalAmount, setTotalAmount] = useState('0.00');
    const [notes, setNotes] = useState('');
    const [reminderEnabled, setReminderEnabled] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddVendorHeader />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <VendorDetailsForm
                    vendorName={vendorName}
                    onVendorNameChange={setVendorName}
                    companyName={companyName}
                    onCompanyNameChange={setCompanyName}
                    address={address}
                    onAddressChange={setAddress}
                />

                <ContactInfoForm
                    email={email}
                    onEmailChange={setEmail}
                    phone={phone}
                    onPhoneChange={setPhone}
                />

                <PaymentSchedule
                    totalAmount={totalAmount}
                    onTotalAmountChange={setTotalAmount}
                />

                <NotesAndReminder
                    notes={notes}
                    onNotesChange={setNotes}
                    reminderEnabled={reminderEnabled}
                    onReminderChange={setReminderEnabled}
                />

                <PrimaryButton
                    title="Save Vendor"
                    onPress={() => { }}
                    icon="save-outline"
                    style={styles.saveButton}
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
        paddingBottom: 40,
    },
    saveButton: {
        marginTop: 10,
        height: 60,
        borderRadius: 16,
    },
});
