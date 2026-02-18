import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { CalendarWrapper, CalendarEvent } from '@/components/calendar/CalendarWrapper';
import { EventList, EventItem } from '@/components/calendar/EventList';

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

    // Mock Events Data
    const MOCK_EVENTS = useMemo(() => [
        { id: '1', title: 'Pick up Wedding Dress', type: 'task', time: '10:00 AM', status: 'Pending', date: '2026-02-18' },
        { id: '2', title: 'Payment for Venue', type: 'payment', amount: '$2,500', status: 'Pending', date: '2026-02-18' },
        { id: '3', title: 'Review Guest List', type: 'task', time: '02:00 PM', status: 'Completed', date: '2026-02-20' },
        { id: '4', title: 'Catering Final Payment', type: 'payment', amount: '$1,200', status: 'Pending', date: '2026-02-25' },
        { id: '5', title: 'Valentine\'s Day', type: 'holiday', date: '2026-02-14' },
        { id: '6', title: 'Wedding Day!', type: 'holiday', date: '2026-06-24' },
    ] as (EventItem & { date: string })[], []);

    // Filter events for indicators in the calendar
    const calendarIndicators: CalendarEvent[] = useMemo(() => {
        return MOCK_EVENTS.map(e => ({ date: e.date, type: e.type }));
    }, [MOCK_EVENTS]);

    // Filter events for the selected day list
    const dayEvents = useMemo(() => {
        return MOCK_EVENTS.filter(e => e.date === selectedDate);
    }, [selectedDate, MOCK_EVENTS]);

    return (
        <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>

                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Planner Calendar</ThemedText>
                    {/* <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
                    </TouchableOpacity> */}
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

            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
    },
    // addButton: {
    //     width: 44,
    //     height: 44,
    //     borderRadius: 12,
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
});
