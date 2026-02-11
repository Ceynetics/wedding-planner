import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
import { Stack, useRouter } from 'expo-router';

export default function SeatingAddScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    const [tableName, setTableName] = useState('');
    const [tableShape, setTableShape] = useState<'curved' | 'square'>('curved');
    const [isVip, setIsVip] = useState(false);
    const [capacity, setCapacity] = useState(5);
    const [guests, setGuests] = useState<Array<{ id: string; name: string; relation: string; avatar?: string }>>([]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AddSeatingHeader />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TableNameInput
                    tableName={tableName}
                    onTableNameChange={setTableName}
                />

                <TableShapeSelector
                    selectedShape={tableShape}
                    onShapeChange={setTableShape}
                />

                <MarkAsVip
                    isVip={isVip}
                    onVipChange={setIsVip}
                />

                <SeatCapacity
                    capacity={capacity}
                    onCapacityChange={setCapacity}
                    minCapacity={0}
                    maxCapacity={10}
                />

                <AddGuests
                    guests={guests}
                    onAddGuest={() => {
                        // TODO: Open guest selector modal
                        console.log('Add guest');
                    }}
                    onRemoveGuest={(id) => {
                        setGuests(guests.filter(g => g.id !== id));
                    }}
                    maxGuests={Math.round(capacity)}
                />

                <PrimaryButton
                    title="Create Table"
                    onPress={() => {
                        // TODO: Handle table creation
                        console.log('Create table:', { tableName, tableShape, isVip, capacity, guests });
                        router.back();
                    }}
                    style={styles.createButton}
                />

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
