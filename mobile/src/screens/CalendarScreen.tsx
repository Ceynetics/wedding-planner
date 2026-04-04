import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { CalendarWrapper, CalendarEvent } from '@/components/calendar/CalendarWrapper';
import { EventList, EventItem } from '@/components/calendar/EventList';
import { useCalendar } from '@/hooks/useCalendar';

/**
 * Main screen for the Calendar tool.
 */
export default function CalendarScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    // State for the selected date (ISO string YYYY-MM-DD)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // State for the month currently being viewed in the calendar (YYYY-MM-01)
    const [currentMonthId, setCurrentMonthId] = useState(selectedDate.substring(0, 7) + '-01');

    const { events, isLoading, fetchEvents } = useCalendar();

    // Fetch events whenever the viewed month changes
    useEffect(() => {
        const month = currentMonthId.substring(0, 7); // YYYY-MM
        fetchEvents(month);
    }, [currentMonthId, fetchEvents]);

    /**
     * Jump to previous month
     */
    const handlePrevMonth = () => {
        const date = new Date(currentMonthId);
        date.setMonth(date.getMonth() - 1);
        setCurrentMonthId(date.toISOString().split('T')[0].substring(0, 7) + '-01');
    };

    /**
     * Jump to next month
     */
    const handleNextMonth = () => {
        const date = new Date(currentMonthId);
        date.setMonth(date.getMonth() + 1);
        setCurrentMonthId(date.toISOString().split('T')[0].substring(0, 7) + '-01');
    };

    /**
     * Jump to a specific month and year
     */
    const handleMonthYearChange = (month: number, year: number) => {
        const date = new Date(year, month, 1);
        setCurrentMonthId(date.toISOString().split('T')[0].substring(0, 7) + '-01');
    };

    // Map API events to the format expected by EventList and CalendarWrapper
    const mappedEvents: (EventItem & { date: string })[] = useMemo(() => {
        return events.map((e, index) => ({
            id: e.referenceId != null ? String(e.referenceId) : `evt-${index}`,
            title: e.title,
            type: (e.type?.toLowerCase() as EventItem['type']) || 'task',
            date: e.date,
            amount: e.amount,
            status: e.status as EventItem['status'],
        }));
    }, [events]);

    // Filter events for indicators in the calendar
    const calendarIndicators: CalendarEvent[] = useMemo(() => {
        return mappedEvents.map(e => ({ date: e.date, type: e.type }));
    }, [mappedEvents]);

    // Filter events for the selected day list
    const insets = useSafeAreaInsets();

    const dayEvents = useMemo(() => {
        return mappedEvents.filter(e => e.date === selectedDate);
    }, [selectedDate, mappedEvents]);

    return (
        <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
            {/* Fixed Header Section */}
            <View style={[styles.fixedArea, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)/tools" as any)}
                        style={[styles.backButton]}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.primaryContrast} />
                    </TouchableOpacity>

                    <ThemedText style={[styles.headerTitle, { color: colors.primaryContrast }]}>
                        Planner Calendar
                    </ThemedText>

                    {/* Placeholder for symmetry to help centering */}
                    <View style={styles.backButton} />
                </View>
            </View>

            {/* Main Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Calendar Component */}
                <CalendarWrapper
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    events={calendarIndicators}
                    currentMonthId={currentMonthId}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onMonthYearChange={handleMonthYearChange}
                />

                {/* Events for selected day */}
                <EventList
                    date={selectedDate}
                    events={dayEvents}
                />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixedArea: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10
    },
    headerTitle: {
        flex: 1,
        fontSize: 22,
        fontWeight: "700",
        textAlign: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
});
