import React, { useMemo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useCalendar, CalendarDayMetadata } from '@marceloterreiro/flash-calendar';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { MonthYearSelector } from './MonthYearSelector';

/**
 * Interface for calendar event indicators
 */
export interface CalendarEvent {
    date: string; // YYYY-MM-DD
    type: 'task' | 'payment' | 'holiday';
}

interface CalendarWrapperProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    events: CalendarEvent[];
    currentMonthId: string;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onMonthYearChange: (month: number, year: number) => void;
}

/**
 * A themed calendar grid built using flash-calendar's logic.
 */
export function CalendarWrapper({
    selectedDate,
    onDateSelect,
    events,
    currentMonthId,
    onPrevMonth,
    onNextMonth,
    onMonthYearChange
}: CalendarWrapperProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [showSelector, setShowSelector] = useState(false);

    // Memoize the active date range to prevent infinite re-render loops in useCalendar
    const activeDateRanges = useMemo(() => [{
        startId: selectedDate,
        endId: selectedDate,
    }], [selectedDate]);

    // Initialize calendar logic for the visible month
    const {
        weeksList,
        weekDaysList,
    } = useCalendar({
        calendarMonthId: currentMonthId,
        calendarActiveDateRanges: activeDateRanges,
    });

    // Extract current month and year from currentMonthId (YYYY-MM-01)
    const monthYear = useMemo(() => {
        const date = new Date(currentMonthId);
        return {
            month: date.getMonth(),
            year: date.getFullYear()
        };
    }, [currentMonthId]);

    // Map events for quick lookup
    const eventsMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        events.forEach(event => {
            if (!map[event.date]) map[event.date] = [];
            map[event.date].push(event.type);
        });
        return map;
    }, [events]);

    // Format Month Name from currentMonthId
    const monthLabel = useMemo(() => {
        const date = new Date(currentMonthId);
        return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }, [currentMonthId]);

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            {/* Header with Navigation and Filter */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onPrevMonth} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerLabel}
                    onPress={() => setShowSelector(true)}
                    activeOpacity={0.6}
                >
                    <ThemedText style={styles.monthText}>{monthLabel}</ThemedText>
                    <Ionicons name="chevron-down" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Month/Year Filter Modal */}
            <MonthYearSelector
                visible={showSelector}
                onClose={() => setShowSelector(false)}
                currentMonth={monthYear.month}
                currentYear={monthYear.year}
                onSelect={onMonthYearChange}
            />

            {/* Week Days Names */}
            <View style={styles.weekDaysRow}>
                {weekDaysList.map((day, index) => (
                    <ThemedText key={index} style={[styles.weekDayText, { color: colors.secondary }]}>
                        {day}
                    </ThemedText>
                ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.grid}>
                {weeksList.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.weekRow}>
                        {week.map((day) => {
                            const isSelected = day.id === selectedDate;
                            const isToday = day.isToday;
                            const isDifferentMonth = day.isDifferentMonth;
                            const dayEvents = eventsMap[day.id] || [];

                            return (
                                <TouchableOpacity
                                    key={day.id}
                                    onPress={() => onDateSelect(day.id)}
                                    style={[
                                        styles.dayContainer,
                                        isSelected && { backgroundColor: colors.primary, borderRadius: 12 },
                                        isToday && !isSelected && { borderColor: colors.primary, borderWidth: 1, borderRadius: 12 }
                                    ]}
                                >
                                    <ThemedText style={[
                                        styles.dayText,
                                        isDifferentMonth && { opacity: 0.3 },
                                        isSelected && { color: colors.primaryContrast, fontWeight: '700' },
                                        isToday && !isSelected && { color: colors.primary, fontWeight: '700' }
                                    ]}>
                                        {day.date.getDate()}
                                    </ThemedText>

                                    {/* Event Indicators */}
                                    <View style={styles.dotContainer}>
                                        {dayEvents.includes('task') && (
                                            <View style={[styles.dot, { backgroundColor: isSelected ? colors.primaryContrast : colors.primary }]} />
                                        )}
                                        {dayEvents.includes('payment') && (
                                            <View style={[styles.dot, { backgroundColor: isSelected ? colors.primaryContrast : colors.error }]} />
                                        )}
                                        {dayEvents.includes('holiday') && (
                                            <View style={[styles.dot, { backgroundColor: isSelected ? colors.primaryContrast : colors.success }]} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    monthText: {
        fontSize: 18,
        fontWeight: '700',
    },
    headerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    navButton: {
        padding: 4,
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    grid: {
        gap: 4,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    dayContainer: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
    },
    dayText: {
        fontSize: 15,
        fontWeight: '500',
    },
    dotContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 6,
        gap: 3,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});
