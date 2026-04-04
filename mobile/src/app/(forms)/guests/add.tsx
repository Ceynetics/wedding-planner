import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AddGuestHeader } from '@/components/guests/form/AddGuestHeader';
import { TextField } from '@/components/TextField';
import { Stepper } from '@/components/guests/form/Stepper';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useGuests } from '@/hooks/useGuests';
import { extractErrorMessage } from '@/utils/errors';
import { required, email as emailValidator, phone as phoneValidator } from '@/utils/validation';
import type { GuestSide, GuestCategory, AddressStyle } from '@/types/api';

import { TableSelectorModal } from '@/components/guests/form/TableSelectorModal';

export default function AddGuestScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { createGuest } = useGuests();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<{ guestName?: string; phone?: string; email?: string }>({});
    const [guestName, setGuestName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');

    const validateForm = () => {
        const newErrors: typeof errors = {};
        newErrors.guestName = required(guestName, 'Guest name');
        if (phone) newErrors.phone = phoneValidator(phone);
        if (email) newErrors.email = emailValidator(email);
        setErrors(newErrors);
        return !newErrors.guestName && !newErrors.phone && !newErrors.email;
    };

    const [side, setSide] = useState<'Bride' | 'Groom'>('Bride');
    const [groupType, setGroupType] = useState<'Family' | 'Individual'>('Family');
    const [isVegetarian, setIsVegetarian] = useState(false); // Dietary preference
    const [category, setCategory] = useState('Family'); // Relationship category
    const [adults, setAdults] = useState(0);
    const [kids, setKids] = useState(0);
    const [isVip, setIsVip] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState<{ id: string; name: string } | null>(null);

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
                    value={guestName}
                    onChangeText={(v) => { setGuestName(v); setErrors(prev => ({ ...prev, guestName: undefined })); }}
                    error={errors.guestName}
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

                {/* Relationship Category */}
                <View style={styles.section}>
                    <ThemedText style={labelStyle}>Relationship</ThemedText>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryWrap}
                    >
                        {['Family', 'Friend', 'Colleague', 'Work', 'Club'].map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setCategory(cat)}
                                style={[
                                    styles.pillButton,
                                    { backgroundColor: colors.inputBackground },
                                    category === cat && { backgroundColor: colors.primary }
                                ]}
                            >
                                <ThemedText style={[
                                    styles.pillText,
                                    { color: category === cat ? colors.primaryContrast : colors.placeholder }
                                ]}>
                                    {cat}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Contact Details */}
                <View style={styles.section}>
                    <ThemedText style={labelStyle}>Contact Details</ThemedText>
                    <TextField
                        placeholder="Phone"
                        value={phone}
                        onChangeText={(v) => { setPhone(v); setErrors(prev => ({ ...prev, phone: undefined })); }}
                        leftIcon={<Ionicons name="call" size={20} color={colors.secondary} />}
                        keyboardType="phone-pad"
                        error={errors.phone}
                    />
                    <TextField
                        placeholder="Email"
                        value={email}
                        onChangeText={(v) => { setEmail(v); setErrors(prev => ({ ...prev, email: undefined })); }}
                        leftIcon={<Ionicons name="mail" size={20} color={colors.secondary} />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
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
                        <MaterialCommunityIcons name="crown" size={24} color={colors.warning} />
                        <ThemedText style={[styles.cardTitle, { color: colors.emphasis }]}>Mark as VIP</ThemedText>
                        <Switch
                            value={isVip}
                            onValueChange={setIsVip}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.primaryContrast}
                        />
                    </View>
                </View>

                {/* Meal Preferences Switch Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.switchRow}>
                        <MaterialCommunityIcons name="leaf" size={24} color={colors.success} />
                        <ThemedText style={[styles.cardTitle, { color: colors.emphasis }]}>Vegetarian Meal</ThemedText>
                        <Switch
                            value={isVegetarian}
                            onValueChange={setIsVegetarian}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.primaryContrast}
                        />
                    </View>
                </View>

                {/* Assign Table Card */}
                <TouchableOpacity
                    style={[styles.card, styles.interactiveCard, { backgroundColor: colors.card }]}
                    onPress={() => setShowTableModal(true)}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                            <MaterialCommunityIcons name="table-furniture" size={20} color={colors.emphasis} />
                        </View>
                        <ThemedText style={[styles.cardItemText, { color: colors.emphasis }]}>
                            {selectedTable ? `Assigned: ${selectedTable.name}` : "Assign a Table"}
                        </ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={colors.placeholder} />
                    </View>
                </TouchableOpacity>

                <TableSelectorModal
                    visible={showTableModal}
                    onClose={() => setShowTableModal(false)}
                    onSelect={(table) => {
                        setSelectedTable({ id: table.id, name: table.name });
                        setShowTableModal(false);
                    }}
                    selectedTableId={selectedTable?.id}
                />

                {/* Special Notes */}
                <View style={styles.section}>
                    <TextField
                        label="Special Notes (Optional)"
                        placeholder="Add more Details If Needed"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={4}
                        labelStyle={labelStyle}
                        inputContainerStyle={styles.textAreaContainer}
                        style={styles.textArea}
                    />
                </View>

                {error ? (
                    <ThemedText style={{ color: colors.error, textAlign: 'center', marginBottom: 12 }}>{error}</ThemedText>
                ) : null}

                <PrimaryButton
                    title="Save Guest"
                    loading={loading}
                    onPress={async () => {
                        if (!validateForm()) return;
                        setLoading(true);
                        setError('');
                        try {
                            await createGuest({
                                name: guestName,
                                side: side.toUpperCase() as GuestSide,
                                category: category.toUpperCase() as GuestCategory,
                                phone: phone || undefined,
                                email: email || undefined,
                                adults: adults || 1,
                                children: kids || 0,
                                dietary: isVegetarian ? 'Vegetarian' : undefined,
                                isVip: isVip,
                                notes: notes || undefined,
                                newHouseholdStyle: (groupType === 'Family' ? 'FAMILY' : 'INDIVIDUAL') as AddressStyle,
                            });
                            router.back();
                        } catch (e) {
                            setError(extractErrorMessage(e));
                        } finally {
                            setLoading(false);
                        }
                    }}
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
        marginBottom: 28,
    },
    toggleContainer: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        padding: 4,
        marginBottom: 28,
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
        marginBottom: 28,
    },
    divider: {
        height: 1,
        marginBottom: 28,
        opacity: 0.5,
    },
    card: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 28,
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
    categoryWrap: {
        flexDirection: 'row',
        gap: 10,
    },
    pillButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
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
        gap: 10,
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
