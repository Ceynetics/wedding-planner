import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface GuestDetailsSectionProps {
    title: string;
    onTitleChange: (text: string) => void;
    guestName: string;
    onGuestNameChange: (text: string) => void;
    guestType: 'You' | 'You Two' | 'Family';
    onGuestTypeChange: (type: 'You' | 'You Two' | 'Family') => void;
}

export function GuestDetailsSection({
    title,
    onTitleChange,
    guestName,
    onGuestNameChange,
    guestType,
    onGuestTypeChange,
}: GuestDetailsSectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const [showTitleDropdown, setShowTitleDropdown] = useState(false);

    const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Miss.', 'Dr.', 'Rev.'];

    const labelStyle = {
        color: colors.emphasis || colors.primary,
        fontSize: 16,
        fontWeight: "700" as const,
        marginBottom: 8,
    };

    return (
        <View style={styles.container}>
            <ThemedText style={[styles.sectionTitle, { color: colors.emphasis || colors.primary }]}>
                Guest Details
            </ThemedText>

            <View style={styles.row}>
                <View style={styles.titleWidth}>
                    <View style={styles.dropdownWrapper}>
                        <TouchableOpacity
                            onPress={() => setShowTitleDropdown(!showTitleDropdown)}
                            activeOpacity={1}
                        >
                            <TextField
                                label="Title"
                                value={title}
                                editable={false}
                                labelStyle={labelStyle}
                                rightIcon={<Ionicons name={showTitleDropdown ? "chevron-up" : "chevron-down"} size={18} color={colors.secondary} />}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>

                        {showTitleDropdown && (
                            <View style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                {TITLES.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.dropdownItem,
                                            title === item && { backgroundColor: theme === 'dark' ? colors.primary + "20" : colors.primary + "10" }
                                        ]}
                                        onPress={() => {
                                            onTitleChange(item);
                                            setShowTitleDropdown(false);
                                        }}
                                    >
                                        <ThemedText style={[
                                            styles.dropdownItemText,
                                            { color: title === item ? colors.primary : colors.text }
                                        ]}>
                                            {item}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.nameWidth}>
                    <TextField
                        label="Guest Name"
                        placeholder="Enter Guest's Name Here"
                        value={guestName}
                        onChangeText={onGuestNameChange}
                        labelStyle={labelStyle}
                    />
                </View>
            </View>

            <View style={styles.typeRow}>
                {[
                    { type: 'You' as const, icon: 'account-outline' },
                    { type: 'You Two' as const, icon: 'account-group-outline' },
                    { type: 'Family' as const, icon: 'home-outline' },
                ].map((item) => (
                    <TouchableOpacity
                        key={item.type}
                        style={[
                            styles.typeCard,
                            { backgroundColor: colors.card },
                            guestType === item.type && { backgroundColor: theme === 'dark' ? colors.primary + "40" : colors.primary },
                        ]}
                        onPress={() => onGuestTypeChange(item.type)}
                    >
                        <MaterialCommunityIcons
                            name={item.icon as any}
                            size={20}
                            color={guestType === item.type ? '#FFF' : colors.emphasis || colors.primary}
                        />
                        <ThemedText style={[
                            styles.typeText,
                            { color: guestType === item.type ? '#FFF' : colors.emphasis || colors.primary }
                        ]}>
                            {item.type}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    titleWidth: {
        width: 100,
        zIndex: 10,
    },
    nameWidth: {
        flex: 1,
    },
    dropdownWrapper: {
        position: 'relative',
    },
    dropdownList: {
        position: 'absolute',
        top: 85,
        left: 0,
        width: 120,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 1000,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownItemText: {
        fontSize: 14,
        fontWeight: '600',
    },
    typeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    typeCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        borderRadius: 12,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    typeText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
