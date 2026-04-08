import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AddGuestHeader } from '@/components/guests/form/AddGuestHeader';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

import { TableSelectorModal } from '@/components/guests/form/TableSelectorModal';

export default function AddGuestScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [side, setSide] = useState<'Bride' | 'Groom'>('Bride');
    const [groupType, setGroupType] = useState<'Family' | 'Individual'>('Family');
    const [category, setCategory] = useState('Family'); // Relationship category
    const [designation, setDesignation] = useState('Mr.'); // Title/Designation
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [guestName, setGuestName] = useState("");
    const [addedGuests, setAddedGuests] = useState<Array<{ title: string, name: string, isVegetarian?: boolean }>>([]);
    const [kids, setKids] = useState(0);
    const [isVip, setIsVip] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState<{ id: string; name: string } | null>(null);

    const DESIGNATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.', 'Rev.'];

    const handleAddGuest = () => {
        if (guestName.trim()) {
            // Include default isVegetarian: false when adding a new guest
            setAddedGuests([...addedGuests, { title: designation, name: guestName.trim(), isVegetarian: false }]);
            setGuestName(""); // Reset input field after adding
        }
    };

    const handleRemoveGuest = (indexToRemove: number) => {
        setAddedGuests(addedGuests.filter((_, index) => index !== indexToRemove));
    };

    const toggleVegetarian = (index: number) => {
        const newGuests = [...addedGuests];
        newGuests[index].isVegetarian = !newGuests[index].isVegetarian;
        setAddedGuests(newGuests);
    };

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

                {/* Guest Side */}
                <View style={styles.section}>
                    <ThemedText style={labelStyle}>Guest Side</ThemedText>
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
                </View>

                {/* Guest Name Section */}
                <View style={styles.section}>
                    <ThemedText style={labelStyle}>Guest Name</ThemedText>
                    <View style={styles.nameInputRow}>
                        <TouchableOpacity
                            style={[styles.designationButton, { backgroundColor: colors.inputBackground }]}
                            onPress={() => setShowDesignationModal(true)}
                        >
                            <ThemedText style={styles.designationText}>{designation}</ThemedText>
                            <Ionicons name="chevron-down" size={16} color={colors.secondary} />
                        </TouchableOpacity>
                        
                        <View style={{ flex: 1 }}>
                            <TextField
                                placeholder="e.g : Joe Charles"
                                containerStyle={{ marginBottom: 0 }}
                                value={guestName}
                                onChangeText={setGuestName}
                            />
                        </View>
                    </View>

                    {/* Add Guest Action Button */}
                    <TouchableOpacity 
                        style={[styles.addGuestBtn, { borderColor: colors.primary + "60" }]}
                        onPress={handleAddGuest}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add" size={20} color={colors.primary} />
                        <ThemedText style={{ color: colors.primary, fontWeight: '700', marginLeft: 8 }}>
                            Add to Group
                        </ThemedText>
                    </TouchableOpacity>

                    {/* Display Added Guests */}
                    {addedGuests.length > 0 && (
                        <View style={styles.addedGuestsContainer}>
                            {addedGuests.map((guest, index) => (
                                <View key={index} style={[styles.guestChip, { backgroundColor: colors.inputBackground }]}>
                                    <ThemedText style={{ fontWeight: '600', color: colors.text }}>
                                        {guest.title} {guest.name}
                                    </ThemedText>
                                    <TouchableOpacity onPress={() => handleRemoveGuest(index)}>
                                        <Ionicons name="close-circle" size={20} color={colors.secondary} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Kids Counter Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.switchRow}>
                        <MaterialCommunityIcons name="baby-carriage" size={24} color={colors.primary} />
                        <ThemedText style={[styles.cardTitle, { color: colors.emphasis }]}>Kids Attending</ThemedText>
                        
                        <View style={[styles.inlineStepper, { backgroundColor: colors.inputBackground }]}>
                            <TouchableOpacity onPress={() => setKids(Math.max(0, kids - 1))} style={styles.stepperBtn}>
                                <Ionicons name="remove" size={18} color={colors.emphasis} />
                            </TouchableOpacity>
                            <ThemedText style={[styles.stepperValue, { color: colors.emphasis }]}>{kids}</ThemedText>
                            <TouchableOpacity onPress={() => setKids(kids + 1)} style={styles.stepperBtn}>
                                <Ionicons name="add" size={18} color={colors.emphasis} />
                            </TouchableOpacity>
                        </View>
                    </View>
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

                {/* Dietary Preferences Section */}
                {addedGuests.length > 0 && (
                    <View style={styles.section}>
                        <ThemedText style={labelStyle}>Dietary Preferences</ThemedText>
                        <View style={[styles.card, { backgroundColor: colors.card, paddingVertical: 8 }]}>
                            {addedGuests.map((guest, index) => (
                                <View 
                                    key={index} 
                                    style={[
                                        styles.dietaryRow, 
                                        index !== addedGuests.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                                    ]}
                                >
                                    <View style={styles.guestInfoCol}>
                                        <ThemedText style={[styles.guestNameText, { color: colors.emphasis }]}>
                                            {guest.title} {guest.name}
                                        </ThemedText>
                                    </View>
                                    
                                    {/* Dietary Toggle Button */}
                                    <TouchableOpacity 
                                        style={[
                                            styles.dietaryToggleBtn, 
                                            guest.isVegetarian 
                                                ? { backgroundColor: colors.success + "20", borderColor: colors.success } 
                                                : { backgroundColor: colors.inputBackground, borderColor: "transparent" }
                                        ]}
                                        onPress={() => toggleVegetarian(index)}
                                    >
                                        <MaterialCommunityIcons 
                                            name="leaf" 
                                            size={18} 
                                            color={guest.isVegetarian ? colors.success : colors.placeholder} 
                                        />
                                        <ThemedText style={[
                                            styles.dietaryToggleText,
                                            { color: guest.isVegetarian ? colors.success : colors.placeholder }
                                        ]}>
                                            Veg
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

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

                {/* Designation Modal */}
                <Modal
                    visible={showDesignationModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDesignationModal(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPress={() => setShowDesignationModal(false)}
                    >
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.modalTitle, { color: colors.emphasis }]}>Select Title</ThemedText>
                            <View style={styles.designationGrid}>
                                {DESIGNATIONS.map((title) => (
                                    <TouchableOpacity
                                        key={title}
                                        style={[
                                            styles.designationOption,
                                            { backgroundColor: colors.inputBackground },
                                            designation === title && { backgroundColor: colors.primary }
                                        ]}
                                        onPress={() => {
                                            setDesignation(title);
                                            setShowDesignationModal(false);
                                        }}
                                    >
                                        <ThemedText style={[
                                            styles.designationOptionText,
                                            { color: designation === title ? colors.primaryContrast : colors.text }
                                        ]}>
                                            {title}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
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
    nameInputRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    designationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
        minWidth: 85,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    designationText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    designationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    designationOption: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: '30%',
        alignItems: 'center',
    },
    designationOptionText: {
        fontSize: 16,
        fontWeight: '600',
    },
    inlineStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 4,
        height: 36,
    },
    stepperBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepperValue: {
        fontSize: 16,
        fontWeight: '700',
        marginHorizontal: 8,
        minWidth: 20,
        textAlign: 'center',
    },
    addGuestBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        marginTop: 16,
    },
    addedGuestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 16,
    },
    guestChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
    },
    // Dietary Preferences Styles
    dietaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    guestInfoCol: {
        flex: 1,
    },
    guestNameText: {
        fontSize: 16,
        fontWeight: '600',
    },
    dietaryToggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    dietaryToggleText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
