import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface ContactInfoFormProps {
    email: string;
    onEmailChange: (text: string) => void;
    phone: string;
    onPhoneChange: (text: string) => void;
    countryCode?: string;
}

export function ContactInfoForm({
    email,
    onEmailChange,
    phone,
    onPhoneChange,
    countryCode = 'LK', // Default to Sri Lanka as seen in screenshot
}: ContactInfoFormProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Section Header Pill - Updated to use theme-aware background to match Romantic Red theme */}
            <View style={[styles.pill, { backgroundColor: colors.vendorContactBg }]}>
                {/* Accent dot and text follow emphasis color for consistent visual weight */}
                <View style={[styles.dot, { backgroundColor: colors.emphasis }]} />
                <ThemedText style={[styles.pillText, { color: colors.emphasis }]}>Contact Info</ThemedText>
            </View>

            <View style={styles.formContent}>
                <TextField
                    label="Email Address :"
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={onEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    containerStyle={styles.inputSpacing}
                />

                <View style={styles.inputSpacing}>
                    <ThemedText style={styles.label}>Phone / WhatsApp :</ThemedText>
                    <View style={[styles.phoneContainer, { backgroundColor: colors.inputBackground }]}>
                        <TouchableOpacity style={[styles.countrySelector, { borderRightColor: colors.border }]}>
                            <Image
                                source={{ uri: 'https://flagcdn.com/w40/lk.png' }}
                                style={styles.flag}
                            />
                        </TouchableOpacity>
                        <TextField
                            placeholder="77 xxx xxxx"
                            value={phone}
                            onChangeText={onPhoneChange}
                            keyboardType="phone-pad"
                            containerStyle={styles.phoneInputContainer}
                            inputContainerStyle={[styles.phoneInput, { borderWidth: 0, backgroundColor: 'transparent' }]}
                        />
                    </View>
                </View>
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    countrySelector: {
        marginRight: 12,
        paddingRight: 12,
        borderRightWidth: 1,
        height: '60%',
        justifyContent: 'center',
    },
    flag: {
        width: 24,
        height: 16,
        borderRadius: 2,
    },
    phoneInputContainer: {
        flex: 1,
        marginBottom: 0, // Reset default margin
    },
    phoneInput: {
        minHeight: 0, // Reset default minHeight to expand
        paddingHorizontal: 0,
    },
});
