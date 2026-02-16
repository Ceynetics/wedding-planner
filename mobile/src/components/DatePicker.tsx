import React, { useState, useMemo } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface DatePickerProps {
    visible: boolean;
    onClose: () => void;
    value: Date;
    onChange: (date: Date) => void;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function DatePicker({ visible, onClose, value, onChange }: DatePickerProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [viewDate, setViewDate] = useState(new Date(value));
    const [viewMode, setViewMode] = useState<'calendar' | 'month' | 'year'>('calendar');

    const daysInMonth = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const date = new Date(year, month, 1);
        const days = [];

        // Add padding for start of month
        const firstDay = date.getDay();
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of month
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return days;
    }, [viewDate]);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const yearsList = [];
        for (let i = currentYear - 50; i <= currentYear + 50; i++) {
            yearsList.push(i);
        }
        return yearsList;
    }, []);

    const handleMonthChange = (monthIndex: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(monthIndex);
        setViewDate(newDate);
        setViewMode('calendar');
    };

    const handleYearChange = (year: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(year);
        setViewDate(newDate);
        setViewMode('calendar');
    };

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const isSelected = (date: Date) => {
        return date.getDate() === value.getDate() &&
            date.getMonth() === value.getMonth() &&
            date.getFullYear() === value.getFullYear();
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const renderCalendar = () => (
        <View>
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={handlePrevMonth}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <TouchableOpacity onPress={() => setViewMode('month')}>
                        <ThemedText style={styles.headerText}>{MONTHS[viewDate.getMonth()]}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode('year')}>
                        <ThemedText style={[styles.headerText, { marginLeft: 8 }]}>{viewDate.getFullYear()}</ThemedText>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleNextMonth}>
                    <Ionicons name="chevron-forward" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <ThemedText key={day} style={styles.weekDayText}>{day}</ThemedText>
                ))}
            </View>

            <View style={styles.daysGrid}>
                {daysInMonth.map((date, index) => (
                    <View key={index} style={styles.dayCell}>
                        {date && (
                            <TouchableOpacity
                                style={[
                                    styles.dayButton,
                                    isSelected(date) && { backgroundColor: colors.primary },
                                    isToday(date) && !isSelected(date) && { borderColor: colors.primary, borderWidth: 1 }
                                ]}
                                onPress={() => {
                                    onChange(date);
                                    onClose();
                                }}
                            >
                                <ThemedText
                                    style={[
                                        styles.dayText,
                                        isSelected(date) && { color: colors.primaryContrast, fontWeight: '700' }
                                    ]}
                                >
                                    {date.getDate()}
                                </ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );

    const renderMonthPicker = () => (
        <View style={styles.gridPicker}>
            <ThemedText style={styles.gridTitle}>Select Month</ThemedText>
            <View style={styles.gridContainer}>
                {MONTHS.map((month, index) => (
                    <TouchableOpacity
                        key={month}
                        style={[
                            styles.gridItem,
                            viewDate.getMonth() === index && { backgroundColor: colors.primary + '20' }
                        ]}
                        onPress={() => handleMonthChange(index)}
                    >
                        <ThemedText
                            style={[
                                styles.gridItemText,
                                viewDate.getMonth() === index && { color: colors.primary, fontWeight: '700' }
                            ]}
                        >
                            {month.substring(0, 3)}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderYearPicker = () => (
        <View style={styles.gridPicker}>
            <ThemedText style={styles.gridTitle}>Select Year</ThemedText>
            <ScrollView style={styles.yearList} showsVerticalScrollIndicator={false}>
                <View style={styles.gridContainer}>
                    {years.map(year => (
                        <TouchableOpacity
                            key={year}
                            style={[
                                styles.gridItem,
                                viewDate.getFullYear() === year && { backgroundColor: colors.primary + '20' }
                            ]}
                            onPress={() => handleYearChange(year)}
                        >
                            <ThemedText
                                style={[
                                    styles.gridItemText,
                                    viewDate.getFullYear() === year && { color: colors.primary, fontWeight: '700' }
                                ]}
                            >
                                {year}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.content, { backgroundColor: colors.card }]}>
                            {viewMode === 'calendar' && renderCalendar()}
                            {viewMode === 'month' && renderMonthPicker()}
                            {viewMode === 'year' && renderYearPicker()}

                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>Cancel</ThemedText>
                            </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
    },
    weekDays: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        opacity: 0.5,
        fontSize: 12,
        fontWeight: '600',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 14,
    },
    gridPicker: {
        paddingVertical: 10,
    },
    gridTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '33.33%',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    gridItemText: {
        fontSize: 15,
    },
    yearList: {
        maxHeight: 300,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 10,
    }
});
