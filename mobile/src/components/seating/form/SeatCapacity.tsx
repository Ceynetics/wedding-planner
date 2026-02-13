import React, { useState, useRef } from 'react';
import { StyleSheet, View, PanResponder, LayoutChangeEvent } from 'react-native';
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
    const [sliderWidth, setSliderWidth] = useState(0);

    const range = maxCapacity - minCapacity;
    const percentage = Math.max(0, Math.min(1, (capacity - minCapacity) / range));

    const updateValue = (locationX: number) => {
        if (sliderWidth <= 0) return;
        const newPercentage = Math.max(0, Math.min(1, locationX / sliderWidth));
        const newValue = Math.round(minCapacity + newPercentage * range);
        onCapacityChange(newValue);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                updateValue(evt.nativeEvent.locationX);
            },
            onPanResponderMove: (evt) => {
                updateValue(evt.nativeEvent.locationX);
            },
        })
    ).current;

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={[styles.label, { color: colors.emphasis }]}>
                Seat Capacity
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                Maximum guests allowed at this table
            </ThemedText>

            <View style={styles.sliderWrapper}>
                <View
                    style={styles.customSliderContainer}
                    onLayout={(e: LayoutChangeEvent) => setSliderWidth(e.nativeEvent.layout.width)}
                    {...panResponder.panHandlers}
                >
                    {/* Track Background */}
                    <View
                        pointerEvents="none"
                        style={[
                            styles.track,
                            { backgroundColor: theme === 'dark' ? colors.border : colors.inputBackground }
                        ]}
                    />

                    {/* Filled Track */}
                    <View
                        pointerEvents="none"
                        style={[
                            styles.filledTrack,
                            {
                                backgroundColor: colors.primary,
                                width: `${percentage * 100}%`
                            }
                        ]}
                    />

                    {/* Thumb */}
                    <View
                        pointerEvents="none"
                        style={[
                            styles.thumb,
                            {
                                backgroundColor: colors.primary,
                                left: `${percentage * 100}%`,
                                borderColor: colors.card,
                                shadowColor: "#000",
                            }
                        ]}
                    />
                </View>

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
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 24,
    },
    sliderWrapper: {
        width: '100%',
        paddingVertical: 10,
    },
    customSliderContainer: {
        width: '100%',
        height: 48, // Taller container for easier touch and thicker track
        justifyContent: 'center',
        position: 'relative',
    },
    track: {
        height: 16, // Thicker track
        width: '100%',
        borderRadius: 8,
        position: 'absolute',
        top: 16, // Center vertically (48 - 16) / 2
    },
    filledTrack: {
        height: 16, // Thicker track
        borderRadius: 8,
        position: 'absolute',
        top: 16, // Center vertically (48 - 16) / 2
    },
    thumb: {
        width: 32, // Larger thumb
        height: 32,
        borderRadius: 16,
        position: 'absolute',
        top: 8, // Center vertically (48 - 32) / 2
        marginLeft: -16, // Center thumb relative to 'left'
        borderWidth: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    rangeLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    capacityBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 52,
        alignItems: 'center',
    },
    capacityText: {
        fontSize: 18,
        fontWeight: '700',
    },
});
