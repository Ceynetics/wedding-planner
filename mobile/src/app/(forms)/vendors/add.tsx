import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AddVendorHeader } from '@/components/vendors/form/AddVendorHeader';
import { VendorCategorySection, VendorCategory } from '@/components/vendors/form/VendorCategorySection';
import { VendorDetailsForm } from '@/components/vendors/form/VendorDetailsForm';
import { ContactInfoForm } from '@/components/vendors/form/ContactInfoForm';
import { PaymentSchedule } from '@/components/vendors/form/PaymentSchedule';
import { PaymentFrequencySection, PaymentFrequency } from '@/components/vendors/form/PaymentFrequencySection';
import { NotesAndReminder } from '@/components/vendors/form/NotesAndReminder';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { useVendors } from '@/hooks/useVendors';
import type { VendorCategory as VendorCategoryType, PaymentFrequency as PaymentFrequencyType } from '@/types/api';
import { extractErrorMessage } from '@/utils/errors';
import { required, email as emailValidator, phone as phoneValidator } from '@/utils/validation';
import { ThemedText } from '@/components/ThemedText';
import { Stack, useRouter } from 'expo-router';

export default function VendorAddScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { createHiredVendor } = useVendors();

    // State management for form fields
    const [vendorName, setVendorName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [totalAmount, setTotalAmount] = useState('0.00');
    const [notes, setNotes] = useState('');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [category, setCategory] = useState<VendorCategory>("Venue"); // Default category selection
    const [frequency, setFrequency] = useState<PaymentFrequency>("One-time");
    const [errors, setErrors] = useState<{ vendorName?: string; email?: string; phone?: string }>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: { vendorName?: string; email?: string; phone?: string } = {};
        newErrors.vendorName = required(vendorName, 'Vendor name');
        newErrors.email = emailValidator(email);
        newErrors.phone = phoneValidator(phone);
        const hasErrors = Object.values(newErrors).some(Boolean);
        setErrors(hasErrors ? newErrors : {});
        return !hasErrors;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddVendorHeader />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Section: Select Category */}
                <VendorCategorySection
                    category={category}
                    onCategoryChange={setCategory}
                />

                {/* Section: Vendor Details */}
                <VendorDetailsForm
                    vendorName={vendorName}
                    onVendorNameChange={(v) => { setVendorName(v); setErrors(prev => ({ ...prev, vendorName: undefined })); }}
                    vendorNameError={errors.vendorName}
                    companyName={companyName}
                    onCompanyNameChange={setCompanyName}
                    address={address}
                    onAddressChange={setAddress}
                />

                <ContactInfoForm
                    email={email}
                    onEmailChange={(v) => { setEmail(v); setErrors(prev => ({ ...prev, email: undefined })); }}
                    emailError={errors.email}
                    phone={phone}
                    onPhoneChange={(v) => { setPhone(v); setErrors(prev => ({ ...prev, phone: undefined })); }}
                    phoneError={errors.phone}
                />

                {/* Section: Payment Frequency Selection */}
                <PaymentFrequencySection
                    frequency={frequency}
                    onFrequencyChange={setFrequency}
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

                {error ? <ThemedText style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</ThemedText> : null}

                <PrimaryButton
                    title="Save Vendor"
                    onPress={async () => {
                        if (!validateForm()) return;
                        setLoading(true);
                        setError('');
                        try {
                            const freqMap: Record<string, string> = {
                                'One-time': 'ONE_TIME', 'Monthly': 'MONTHLY', 'Quarterly': 'QUARTERLY',
                                'Bi-annual': 'BI_ANNUAL', 'Annual': 'ANNUAL'
                            };
                            await createHiredVendor({
                                vendorName,
                                companyName,
                                category: category.toUpperCase() as VendorCategoryType,
                                address,
                                email,
                                phone,
                                totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
                                notes,
                                reminderEnabled,
                                frequency: (freqMap[frequency] || 'ONE_TIME') as PaymentFrequencyType,
                            });
                            router.back();
                        } catch (e) {
                            setError(extractErrorMessage(e));
                        } finally {
                            setLoading(false);
                        }
                    }}
                    loading={loading}
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
