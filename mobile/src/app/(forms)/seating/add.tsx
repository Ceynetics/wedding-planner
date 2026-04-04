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
import { useSeatingTables } from '@/hooks/useSeatingTables';
import type { TableShape } from '@/types/api';
import { extractErrorMessage } from '@/utils/errors';
import { required } from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';

export default function SeatingAddScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { createTable } = useSeatingTables();

    const [tableName, setTableName] = useState('');
    const [tableShape, setTableShape] = useState<'curved' | 'square'>('curved');
    const [isVip, setIsVip] = useState(false);
    const [capacity, setCapacity] = useState(5);
    const [guests, setGuests] = useState<Array<{ id: string; name: string; relation: string; avatar?: string }>>([]);
    const [errors, setErrors] = useState<{ tableName?: string }>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: { tableName?: string } = {};
        newErrors.tableName = required(tableName, 'Table name');
        const hasErrors = Object.values(newErrors).some(Boolean);
        setErrors(hasErrors ? newErrors : {});
        return !hasErrors;
    };

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
                    onTableNameChange={(v) => { setTableName(v); setErrors(prev => ({ ...prev, tableName: undefined })); }}
                    error={errors.tableName}
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
                        router.push('/(forms)/seating/select-guests' as any);
                    }}
                    onRemoveGuest={(id) => {
                        setGuests(guests.filter(g => g.id !== id));
                    }}
                    maxGuests={Math.round(capacity)}
                />

                {error ? <ThemedText style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</ThemedText> : null}

                <PrimaryButton
                    title="Create Table"
                    onPress={async () => {
                        if (!validateForm()) return;
                        setLoading(true);
                        setError('');
                        try {
                            const shapeMap: Record<string, string> = { 'curved': 'ROUND', 'square': 'SQUARE' };
                            await createTable({
                                name: tableName,
                                tableShape: (shapeMap[tableShape] || 'ROUND') as TableShape,
                                chairCount: capacity,
                                isVip: isVip,
                            });
                            router.back();
                        } catch (e) {
                            setError(extractErrorMessage(e));
                        } finally {
                            setLoading(false);
                        }
                    }}
                    loading={loading}
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
