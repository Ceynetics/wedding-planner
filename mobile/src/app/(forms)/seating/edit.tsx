import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { AddSeatingHeader } from '@/components/seating/form/AddSeatingHeader';
import { TableNameInput } from '@/components/seating/form/TableNameInput';
import { TableShapeSelector } from '@/components/seating/form/TableShapeSelector';
import { MarkAsVip } from '@/components/seating/form/MarkAsVip';
import { SeatCapacity } from '@/components/seating/form/SeatCapacity';
import { AddGuests } from '@/components/seating/form/AddGuests';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

export default function SeatingEditScreen() {
    // --- Context & Navigation ---
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    // Safely retrieve the targeted table ID from the navigation route params
    const { id } = useLocalSearchParams();

    // --- State Management ---
    // Pre-populate with dummy edit data tied to the mocked database state
    const [tableName, setTableName] = useState('Head Table');
    const [tableShape, setTableShape] = useState<'curved' | 'square'>('curved');
    const [isVip, setIsVip] = useState(true);
    const [capacity, setCapacity] = useState(10);
    const [guests, setGuests] = useState<Array<{ id: string; name: string; relation: string; avatar?: string }>>([
        { id: "1", name: "Joe Charles", relation: "Family" }
    ]);

    // Update dispatch handler logic
    const handleUpdateTable = () => {
        console.log('Update table:', { id, tableName, tableShape, isVip, capacity, guests });
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Suppress standard header in favor of the custom AddSeatingHeader component */}
            <Stack.Screen options={{ headerShown: false }} />
            <AddSeatingHeader />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* 1. Table Identification Input */}
                <TableNameInput
                    tableName={tableName}
                    onTableNameChange={setTableName}
                />

                {/* 2. Shape Mapping Selection */}
                <TableShapeSelector
                    selectedShape={tableShape}
                    onShapeChange={setTableShape}
                />

                {/* 3. VIP Classification Toggle */}
                <MarkAsVip
                    isVip={isVip}
                    onVipChange={setIsVip}
                />

                {/* 4. Global Seating Capacity Stepper */}
                <SeatCapacity
                    capacity={capacity}
                    onCapacityChange={setCapacity}
                    minCapacity={0}
                    maxCapacity={10}
                />

                {/* 5. Assigned Guests Roster Mapping */}
                <AddGuests
                    guests={guests}
                    onAddGuest={() => {
                        // Routing out to guest picker module
                        router.push('/(forms)/seating/select-guests' as any);
                    }}
                    onRemoveGuest={(guestId) => {
                        setGuests(guests.filter(g => g.id !== guestId));
                    }}
                    maxGuests={Math.round(capacity)}
                />

                {/* 6. Form Submission Action */}
                <PrimaryButton
                    title="Update Table"
                    onPress={handleUpdateTable}
                    style={styles.createButton}
                />

                {/* Graceful navigation bailout option */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <ThemedText style={[styles.cancelText, { color: colors.secondary }]}>
                        Cancel
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Ensures complete UI component presentation stays separate and cleanly abstracted
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    createButton: {
        marginTop: 10,
        height: 60,
        borderRadius: 16,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
