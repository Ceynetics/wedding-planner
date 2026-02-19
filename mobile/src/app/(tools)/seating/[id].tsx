import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TableNameInput } from '@/components/seating/form/TableNameInput';
import { TableShapeSelector } from '@/components/seating/form/TableShapeSelector';
import { MarkAsVip } from '@/components/seating/form/MarkAsVip';
import { SeatCapacity } from '@/components/seating/form/SeatCapacity';
import { AddGuests } from '@/components/seating/form/AddGuests';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * SeatingDetailScreen - Displays and allows editing of a specific table's details.
 * Following the design pattern of the 'Add Table' form for consistency.
 */
export default function SeatingDetailScreen() {
    // Hooks
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    // State management for table data
    // In a production app, these would be initialized from a data store or API
    const [tableName, setTableName] = useState('Head Table');
    const [tableShape, setTableShape] = useState<'curved' | 'square'>('curved');
    const [isVip, setIsVip] = useState(true);
    const [capacity, setCapacity] = useState(10);
    const [guests, setGuests] = useState<Array<{ id: string; name: string; relation: string; avatar?: string }>>([
        { id: '1', name: 'John Doe', relation: 'Groom' },
        { id: '2', name: 'Jane Doe', relation: 'Bride' },
    ]);

    /**
     * Handles the update logic for the table
     */
    const handleUpdate = () => {
        // Implementation for updating table data
        console.log('Update table:', { id, tableName, tableShape, isVip, capacity, guests });
        router.back();
    };

    /**
     * Handles the deletion of the table
     */
    const handleDelete = () => {
        // Implementation for deleting the table
        console.log('Delete table:', id);
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Configure Screen Options */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* 
                Custom Header Section 
                - Removed solid background (colors.primary) 
                - Uses theme-aware background color
            */}
            <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color={colors.emphasis} />
                </TouchableOpacity>
                <ThemedText style={[styles.title, { color: colors.emphasis }]}>
                    Table Details
                </ThemedText>
            </View>

            {/* Main Form Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Table Identity */}
                <TableNameInput
                    tableName={tableName}
                    onTableNameChange={setTableName}
                />

                {/* Physical Configuration */}
                <TableShapeSelector
                    selectedShape={tableShape}
                    onShapeChange={setTableShape}
                />

                {/* Priority Status */}
                <MarkAsVip
                    isVip={isVip}
                    onVipChange={setIsVip}
                />

                {/* Seat Management */}
                <SeatCapacity
                    capacity={capacity}
                    onCapacityChange={setCapacity}
                    minCapacity={0}
                    maxCapacity={20}
                />

                {/* Guest Assignments */}
                <AddGuests
                    guests={guests}
                    onAddGuest={() => {
                        // Navigate to guest selection screen
                        router.push('/(forms)/seating/select-guests' as any);
                    }}
                    onRemoveGuest={(id) => {
                        setGuests(guests.filter(g => g.id !== id));
                    }}
                    maxGuests={Math.round(capacity)}
                />

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title="Update Table"
                        onPress={handleUpdate}
                        style={styles.updateButton}
                    />

                    <TouchableOpacity
                        style={[styles.deleteButton, { borderColor: colors.error + '40' }]}
                        onPress={handleDelete}
                    >
                        <ThemedText style={[styles.deleteText, { color: colors.error }]}>
                            Delete Table
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Safe bottom area for scrolling */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 16,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        // Elevation for Android
        elevation: 2,
        // Shadows for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    buttonContainer: {
        marginTop: 10,
        gap: 8,
    },
    updateButton: {
        height: 60,
        borderRadius: 16,
    },
    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        marginTop: 8,
    },
    deleteText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
