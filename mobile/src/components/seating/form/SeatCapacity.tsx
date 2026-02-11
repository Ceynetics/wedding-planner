import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface SeatCapacityProps {
    capacity: number;
    onCapacityChange: (value: number) => void;
    minCapacity?: number;
    maxCapacity?: number;
}

export function SeatCapacity({
    capacity,
    onCapacityChange,
    minCapacity = 0,
    maxCapacity = 10,
}: SeatCapacityProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={[styles.label, { color: colors.emphasis }]}>
                Seat Capacity
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                Maximum guests allowed at this table
            </ThemedText>

            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={minCapacity}
                    maximumValue={maxCapacity}
                    step={1}
                    value={capacity}
                    onValueChange={onCapacityChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={theme === 'dark' ? colors.border : colors.inputBackground}
                    thumbTintColor={colors.primary}
                />
                <View style={styles.labelsContainer}>
                    <ThemedText style={[styles.rangeLabel, { color: colors.secondary }]}>
                        {minCapacity}
                    </ThemedText>
                    <View style={[styles.capacityBadge, { backgroundColor: colors.primary }]}>
                        <ThemedText style={[styles.capacityText, { color: colors.primaryContrast }]}>
                            {Math.round(capacity)}
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.rangeLabel, { color: colors.secondary }]}>
                        {maxCapacity}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    container: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 20,
    },
    sliderContainer: {
        width: '100%',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    rangeLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    capacityBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 50,
        alignItems: 'center',
    },
    capacityText: {
        fontSize: 18,
        fontWeight: '700',
    },
});
