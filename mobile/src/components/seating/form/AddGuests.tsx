import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface Guest {
    id: string;
    name: string;
    relation: string;
    avatar?: string;
}

interface AddGuestsProps {
    guests: Guest[];
    onAddGuest: () => void;
    onRemoveGuest: (id: string) => void;
    maxGuests: number;
}

export function AddGuests({
    guests,
    onAddGuest,
    onRemoveGuest,
    maxGuests,
}: AddGuestsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const remainingSlots = maxGuests - guests.length;

    return (
        <View style={styles.container}>
            <ThemedText style={[styles.label, { color: colors.emphasis }]}>
                Add Guests
            </ThemedText>

            <View style={styles.guestsContainer}>
                {/* Existing Guests */}
                {guests.map((guest) => (
                    <View key={guest.id} style={[styles.guestCard, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={[styles.removeButton, { backgroundColor: colors.error + '20' }]}
                            onPress={() => onRemoveGuest(guest.id)}
                        >
                            <Ionicons name="close" size={16} color={colors.error} />
                        </TouchableOpacity>
                        {guest.avatar ? (
                            <Image source={{ uri: guest.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                                <Ionicons name="person" size={24} color={colors.primary} />
                            </View>
                        )}
                        <ThemedText style={[styles.guestName, { color: colors.emphasis }]} numberOfLines={1}>
                            {guest.name}
                        </ThemedText>
                        <ThemedText style={[styles.guestRelation, { color: colors.secondary }]} numberOfLines={1}>
                            {guest.relation}
                        </ThemedText>
                    </View>
                ))}

                {/* Add Guest Button */}
                <TouchableOpacity
                    style={[styles.addGuestCard, { backgroundColor: colors.card, borderColor: colors.border, borderStyle: 'dashed' }]}
                    onPress={onAddGuest}
                    disabled={remainingSlots <= 0}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={32}
                        color={remainingSlots > 0 ? colors.primary : colors.secondary}
                    />
                </TouchableOpacity>
            </View>

            {/* Guest Count */}
            <View style={styles.countContainer}>
                <View style={[styles.countBar, { backgroundColor: colors.inputBackground }]}>
                    <View
                        style={[
                            styles.countBarFill,
                            {
                                backgroundColor: colors.primary,
                                width: `${(guests.length / maxGuests) * 100}%`
                            }
                        ]}
                    />
                </View>
                <ThemedText style={[styles.countText, { color: colors.secondary }]}>
                    {guests.length}/{maxGuests} Guests
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    guestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    guestCard: {
        width: 100,
        height: 120,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 8,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guestName: {
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 2,
    },
    guestRelation: {
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
    },
    addGuestCard: {
        width: 100,
        height: 120,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countContainer: {
        marginTop: 8,
    },
    countBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    countBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    countText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right',
    },
});
