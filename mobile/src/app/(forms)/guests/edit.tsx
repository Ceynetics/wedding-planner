import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Modules & Components ---
import { AddGuestHeader } from '@/components/guests/form/AddGuestHeader';
import { TextField } from '@/components/TextField';
import { Stepper } from '@/components/guests/form/Stepper';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { TableSelectorModal } from '@/components/guests/form/TableSelectorModal';

// --- Design System ---
import { useAppTheme } from '@/context/ThemeContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Colors } from '@/constants/Colors';
import { guestApi } from '@/api/endpoints';
import { useGuests } from '@/hooks/useGuests';
import { extractErrorMessage } from '@/utils/errors';
import { displayEnum } from '@/utils/enums';
import type { GuestSide, GuestCategory } from '@/types/api';

export default function EditGuestScreen() {
    // Determine current theme settings dynamically
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { workspace } = useWorkspace();
    const { updateGuest } = useGuests();

    const [name, setName] = useState('');
    const [side, setSide] = useState<'Bride' | 'Groom'>('Bride');
    const [groupType, setGroupType] = useState<'Family' | 'Individual'>('Family');
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [category, setCategory] = useState('Family');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [adults, setAdults] = useState(1);
    const [kids, setKids] = useState(0);
    const [isVip, setIsVip] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (workspace && id) {
            guestApi.getById(workspace.id, Number(id)).then(({ data }) => {
                setName(data.name);
                setSide(displayEnum(data.side) as any || 'Bride');
                setCategory(displayEnum(data.category) || 'Family');
                setPhone(data.phone || '');
                setEmail(data.email || '');
                setAdults(data.adults || 1);
                setKids(data.children || 0);
                setIsVip(data.isVip);
                setIsVegetarian(data.dietary === 'Vegetarian');
                setNotes(data.notes || '');
            }).catch(() => {});
        }
    }, [workspace, id]);
    
    // Extracted Modal View tracking state
    const [showTableModal, setShowTableModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState<{ id: string; name: string } | null>({
        id: "1",
        name: "Table 1"
    });

    // We maintain dynamic theming elements inline here instead of StyleSheet.create
    // to natively bind them against active light/dark mode changes.
    const dynamicLabelStyle = {
        color: colors.emphasis,
        opacity: 1,
        fontWeight: '700' as const,
        marginBottom: 12,
        fontSize: 16
    };

    const handleUpdateGuest = async () => {
        try {
            await updateGuest(Number(id), {
                name,
                side: side.toUpperCase() as GuestSide,
                category: category.toUpperCase() as GuestCategory,
                phone,
                email,
                adults,
                children: kids,
                dietary: isVegetarian ? 'Vegetarian' : undefined,
                isVip,
                notes: notes || undefined,
            });
            router.back();
        } catch (e) {
            alert(extractErrorMessage(e));
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Disable default header entirely, favoring custom layout component */}
            <Stack.Screen options={{ headerShown: false }} />
            <AddGuestHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled" // Enhances UX by retaining scroll fluidity while keyboard is up
            >
                {/* 1. Guest Identification */}
                <TextField
                    label="Guest Name"
                    placeholder="e.g : Joe Charles"
                    value={name}
                    onChangeText={setName}
                    labelStyle={dynamicLabelStyle}
                />

                {/* 2. Affiliation Toggle (Bride vs Groom) */}
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
                        ]}>
                            Bride
                        </ThemedText>
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
                        ]}>
                            Groom
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Relationship Category (Family, Colleague, Work, Club, Friend) */}
                <View style={styles.section}>
                    <ThemedText style={dynamicLabelStyle}>Relationship</ThemedText>
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

                {/* 3. Direct Contact Info Fields */}
                <View style={styles.section}>
                    <ThemedText style={dynamicLabelStyle}>Contact Details</ThemedText>
                    <TextField
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        leftIcon={<Ionicons name="call" size={20} color={colors.secondary} />}
                        keyboardType="phone-pad"
                    />
                    <TextField
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        leftIcon={<Ionicons name="mail" size={20} color={colors.secondary} />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* 4. Family or Individual Flag Modifier */}
                <View style={styles.section}>
                    <ThemedText style={dynamicLabelStyle}>Group</ThemedText>
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
                            ]}>
                                Family
                            </ThemedText>
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
                            ]}>
                                Individual
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 5. Headcount Trackers via Stepper Inputs */}
                <View style={styles.stepperRow}>
                    <Stepper label="Adults" value={adults} onValueChange={setAdults} />
                    <Stepper label="Kids" value={kids} onValueChange={setKids} />
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* 6. Settings Switches and Special Permissions */}
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

                {/* Dietary Settings Switch */}
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

                {/* 7. Table and Seating Sub-Form Mapping */}
                <TouchableOpacity
                    style={[styles.card, styles.interactiveCard, { backgroundColor: colors.card }]}
                    onPress={() => setShowTableModal(true)}
                    activeOpacity={0.7}
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

                {/* Table Picker Overlay rendering */}
                <TableSelectorModal
                    visible={showTableModal}
                    onClose={() => setShowTableModal(false)}
                    onSelect={(table) => {
                        setSelectedTable({ id: table.id, name: table.name });
                        setShowTableModal(false);
                    }}
                    selectedTableId={selectedTable?.id}
                />

                {/* 8. Additional Comments field handling free-text metadata */}
                <View style={styles.section}>
                    <TextField
                        label="Special Notes (Optional)"
                        placeholder="Add more Details If Needed"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={4}
                        labelStyle={dynamicLabelStyle}
                        inputContainerStyle={styles.textAreaContainer}
                        style={styles.textArea}
                    />
                </View>

                {/* 9. Final Update Commit Action Button */}
                <PrimaryButton
                    title="Update Guest"
                    onPress={handleUpdateGuest}
                    style={styles.saveButton}
                />
            </ScrollView>
        </View>
    );
}

// Ensure strict adherence to separation of structural logic and UI styling components.
// Colors remain completely isolated from standard sizing, padding, and alignments.
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
