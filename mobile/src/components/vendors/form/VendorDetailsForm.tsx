import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface VendorDetailsFormProps {
    vendorName: string;
    onVendorNameChange: (text: string) => void;
    companyName: string;
    onCompanyNameChange: (text: string) => void;
    address: string;
    onAddressChange: (text: string) => void;
}

export function VendorDetailsForm({
    vendorName,
    onVendorNameChange,
    companyName,
    onCompanyNameChange,
    address,
    onAddressChange,
}: VendorDetailsFormProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Section Header Pill - Updated to use theme-aware vendor background colors */}
            <View style={[styles.pill, { backgroundColor: colors.vendorContactBg }]}>
                {/* Dot and Text useemphasis color for clear visibility across themes */}
                <View style={[styles.dot, { backgroundColor: colors.emphasis }]} />
                <ThemedText style={[styles.pillText, { color: colors.emphasis }]}>Vendor Details</ThemedText>
            </View>

            <View style={styles.formContent}>
                <TextField
                    label="Vendor Name"
                    placeholder="e.g : Main Event"
                    value={vendorName}
                    onChangeText={onVendorNameChange}
                    containerStyle={styles.inputSpacing}
                />

                <TextField
                    label="Company Name"
                    placeholder="e.g : Lio Studios"
                    value={companyName}
                    onChangeText={onCompanyNameChange}
                    containerStyle={styles.inputSpacing}
                />

                <TextField
                    label="Address"
                    placeholder="123/A, High Lvl. Rd, Cmb"
                    value={address}
                    onChangeText={onAddressChange}
                    containerStyle={styles.inputSpacing}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 20,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 8,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '700',
    },
    formContent: {
        gap: 4,
    },
    inputSpacing: {
        marginBottom: 16,
    },
});
