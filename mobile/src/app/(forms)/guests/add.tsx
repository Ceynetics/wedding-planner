import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AddGuestHeader } from '@/components/guests/form/AddGuestHeader';
import { TextField } from '@/components/TextField';
import { Stepper } from '@/components/guests/form/Stepper';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function AddGuestScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [side, setSide] = useState<'Bride' | 'Groom'>('Bride');
    const [groupType, setGroupType] = useState<'Family' | 'Individual'>('Family');
    const [adults, setAdults] = useState(0);
    const [kids, setKids] = useState(0);
    const [isVip, setIsVip] = useState(false);

    const labelStyle = {
        color: colors.emphasis,
        opacity: 1,
        fontWeight: '700' as const,
        marginBottom: 12,
        fontSize: 16
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddGuestHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Guest Name */}
                <TextField
                    label="Guest Name"
                    placeholder="e.g : Joe Charles"
                    labelStyle={labelStyle}
                />

                {/* Side Toggle */}
                <View style={[styles.toggleContainer, { backgroundColor: colors.inputBackground }]}>
                    <TouchableOpacity
                        onPress={() => setSide('Bride')}
                        style={[
                            styles.toggleButton,
                            side === 'Bride' && { backgroundColor: colors.primary }
                        ]}
                    >
                        <ThemedText style={[
                            styles.toggleText,
                            { color: side === 'Bride' ? colors.primaryContrast : colors.placeholder }
                        ]}>Bride</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSide('Groom')}
                        style={[
                            styles.toggleButton,
                            side === 'Groom' && { backgroundColor: colors.primary }
                        ]}
                    >
                        <ThemedText style={[
                            styles.toggleText,
                            { color: side === 'Groom' ? colors.primaryContrast : colors.placeholder }
                        ]}>Groom</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Contact Details */}
                <View style={styles.section}>
                    <ThemedText style={labelStyle}>Contact Details</ThemedText>
                    <TextField
                        placeholder="Phone"
                        leftIcon={<Ionicons name="call" size={20} color={colors.secondary} />}
                        keyboardType="phone-pad"
                    />
                    <TextField
                        placeholder="Email"
                        leftIcon={<Ionicons name="mail" size={20} color={colors.secondary} />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Group Toggle */}
                <View style={styles.section}>
                    <ThemedText style={labelStyle}>Group</ThemedText>
                    <View style={[styles.toggleContainer, { backgroundColor: colors.inputBackground }]}>
                        <TouchableOpacity
                            onPress={() => setGroupType('Family')}
                            style={[
                                styles.toggleButton,
                                groupType === 'Family' && { backgroundColor: colors.primary }
                            ]}
                        >
                            <ThemedText style={[
                                styles.toggleText,
                                { color: groupType === 'Family' ? colors.primaryContrast : colors.placeholder }
                            ]}>Family</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setGroupType('Individual')}
                            style={[
                                styles.toggleButton,
                                groupType === 'Individual' && { backgroundColor: colors.primary }
                            ]}
                        >
                            <ThemedText style={[
                                styles.toggleText,
                                { color: groupType === 'Individual' ? colors.primaryContrast : colors.placeholder }
                            ]}>Individual</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Steppers */}
                <View style={styles.stepperRow}>
                    <Stepper label="Adults" value={adults} onValueChange={setAdults} />
                    <Stepper label="Kids" value={kids} onValueChange={setKids} />
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* VIP Switch Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.switchRow}>
                        <ThemedText style={[styles.cardTitle, { color: colors.emphasis }]}>Mark as VIP</ThemedText>
                        <Switch
                            value={isVip}
                            onValueChange={setIsVip}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.primaryContrast}
                        />
                    </View>
                </View>

                {/* Assign Table Card */}
                <TouchableOpacity style={[styles.card, styles.interactiveCard, { backgroundColor: colors.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                            <Ionicons name="restaurant" size={20} color={colors.emphasis} />
                        </View>
                        <ThemedText style={[styles.cardItemText, { color: colors.emphasis }]}>Assign a Table</ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={colors.placeholder} />
                    </View>
                </TouchableOpacity>

                {/* Special Notes */}
                <View style={styles.section}>
                    <TextField
                        label="Special Notes (Optional)"
                        placeholder="Add more Details If Needed"
                        multiline
                        numberOfLines={4}
                        labelStyle={labelStyle}
                        inputContainerStyle={styles.textAreaContainer}
                        style={styles.textArea}
                    />
                </View>

                <PrimaryButton
                    title="Save Guest"
                    onPress={() => { }}
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
    section: {
        marginBottom: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
    },
    toggleButton: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '700',
    },
    stepperRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        marginBottom: 20,
        opacity: 0.5,
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
    interactiveCard: {
        paddingVertical: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    cardItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textAreaContainer: {
        minHeight: 120,
        alignItems: 'flex-start',
    },
    textArea: {
        textAlignVertical: 'top',
    },
    saveButton: {
        marginTop: 10,
        height: 60,
        borderRadius: 16,
    },
});
