import React, { useMemo, useState, useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface MonthYearSelectorProps {
    visible: boolean;
    onClose: () => void;
    currentMonth: number; // 0-11
    currentYear: number;
    onSelect: (month: number, year: number) => void;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * A specialized modal for picking a month and year for the calendar.
 * Uses a clean, modern design with blur effect.
 */
export function MonthYearSelector({
    visible,
    onClose,
    currentMonth,
    currentYear,
    onSelect
}: MonthYearSelectorProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [tempMonth, setTempMonth] = useState(currentMonth);
    const [tempYear, setTempYear] = useState(currentYear);
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

    // Reset temporary selection to current actual month/year whenever modal opens
    useEffect(() => {
        if (visible) {
            setTempMonth(currentMonth);
            setTempYear(currentYear);
            setViewMode('month'); // Reset to month tab by default
        }
    }, [visible, currentMonth, currentYear]);

    // Generate a range of years (current year - 10 to current year + 20)
    const years = useMemo(() => {
        const startYear = new Date().getFullYear() - 5;
        const yearsList = [];
        for (let i = 0; i < 25; i++) {
            yearsList.push(startYear + i);
        }
        return yearsList;
    }, []);

    const handleApply = () => {
        onSelect(tempMonth, tempYear);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    {theme === 'dark' ? (
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    ) : (
                        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                    )}

                    <TouchableWithoutFeedback>
                        <View style={[styles.content, { backgroundColor: colors.card }]}>
                            {/* Header Tabs */}
                            <View style={styles.tabs}>
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        viewMode === 'month' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                                    ]}
                                    onPress={() => setViewMode('month')}
                                >
                                    <ThemedText style={[
                                        styles.tabText,
                                        viewMode === 'month' && { color: colors.primary, fontWeight: '700' }
                                    ]}>Month</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        viewMode === 'year' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                                    ]}
                                    onPress={() => setViewMode('year')}
                                >
                                    <ThemedText style={[
                                        styles.tabText,
                                        viewMode === 'year' && { color: colors.primary, fontWeight: '700' }
                                    ]}>Year</ThemedText>
                                </TouchableOpacity>
                            </View>

                            {/* Selection Area */}
                            <View style={styles.selectionArea}>
                                {viewMode === 'month' ? (
                                    <View style={styles.monthGrid}>
                                        {MONTHS.map((month, index) => (
                                            <TouchableOpacity
                                                key={month}
                                                style={[
                                                    styles.gridItem,
                                                    tempMonth === index && { backgroundColor: colors.primary + '15' }
                                                ]}
                                                onPress={() => setTempMonth(index)}
                                            >
                                                <ThemedText style={[
                                                    styles.gridItemText,
                                                    tempMonth === index && { color: colors.primary, fontWeight: '700' }
                                                ]}>
                                                    {month.substring(0, 3)}
                                                </ThemedText>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ) : (
                                    <ScrollView style={styles.yearScroll} showsVerticalScrollIndicator={false}>
                                        <View style={styles.yearGrid}>
                                            {years.map((year) => (
                                                <TouchableOpacity
                                                    key={year}
                                                    style={[
                                                        styles.gridItem,
                                                        tempYear === year && { backgroundColor: colors.primary + '15' }
                                                    ]}
                                                    onPress={() => setTempYear(year)}
                                                >
                                                    <ThemedText style={[
                                                        styles.gridItemText,
                                                        tempYear === year && { color: colors.primary, fontWeight: '700' }
                                                    ]}>
                                                        {year}
                                                    </ThemedText>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                )}
                            </View>

                            {/* Footer Actions */}
                            <View style={styles.footer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                    <ThemedText style={{ color: colors.secondary }}>Cancel</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.applyButton, { backgroundColor: colors.primary }]}
                                    onPress={handleApply}
                                >
                                    <ThemedText style={{ color: colors.primaryContrast, fontWeight: '700' }}>Apply</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        borderRadius: 32,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    selectionArea: {
        minHeight: 250,
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    yearGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    yearScroll: {
        maxHeight: 250,
    },
    gridItem: {
        width: '33.33%',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 16,
    },
    gridItemText: {
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
        gap: 12,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    applyButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
    }
});
