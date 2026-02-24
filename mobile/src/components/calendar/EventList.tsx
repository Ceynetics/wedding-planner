import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Interface for individual event items
 */
export interface EventItem {
    id: string;
    title: string;
    type: 'task' | 'payment' | 'holiday';
    date: string; // YYYY-MM-DD
    time?: string;
    amount?: string;
    status?: 'Pending' | 'Completed';
}

interface EventListProps {
    date: string;
    events: EventItem[];
}

/**
 * Component to display the list of events for a specific day.
 */
export function EventList({ date, events }: EventListProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    // Format the date for the title (e.g., Feb 18, 2026)
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const renderItem = ({ item }: { item: EventItem }) => {
        const isTask = item.type === 'task';
        const isPayment = item.type === 'payment';
        const isHoliday = item.type === 'holiday';

        let iconName: any = 'checkbox-blank-circle-outline';
        if (isTask) iconName = 'format-list-checks';
        if (isPayment) iconName = 'cash-multiple';
        if (isHoliday) iconName = 'calendar-star';

        let iconColor = colors.primary;
        if (isPayment) iconColor = colors.expenseRed;
        if (isHoliday) iconColor = colors.success;

        return (
            <View style={[styles.eventCard, { backgroundColor: colors.card }]}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
                    <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
                </View>
                <View style={styles.eventInfo}>
                    <ThemedText style={styles.eventTitle}>{item.title}</ThemedText>
                    <View style={styles.eventMeta}>
                        {item.time && (
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={14} color={colors.secondary} />
                                <ThemedText style={[styles.metaText, { color: colors.secondary }]}>{item.time}</ThemedText>
                            </View>
                        )}
                        {item.amount && (
                            <ThemedText style={[styles.amountText, { color: colors.error }]}>
                                {item.amount}
                            </ThemedText>
                        )}
                        {item.status && (
                            <ThemedText style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: item.status === 'Completed' ? colors.success + '20' : colors.warning + '20',
                                    color: item.status === 'Completed' ? colors.success : colors.warning
                                }
                            ]}>
                                {item.status}
                            </ThemedText>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.sectionTitle}>Events on {formattedDate}</ThemedText>
                <ThemedText style={[styles.countText, { color: colors.secondary }]}>
                    {events.length} {events.length === 1 ? 'event' : 'events'}
                </ThemedText>
            </View>

            {events.length > 0 ? (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    scrollEnabled={false} // Since it's inside a ScrollView in the main screen
                />
            ) : (
                <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
                    <Ionicons name="calendar-outline" size={48} color={colors.border} />
                    <ThemedText style={[styles.emptyText, { color: colors.secondary }]}>
                        No scheduled events for this day.
                    </ThemedText>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    countText: {
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        gap: 12,
    },
    eventCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 13,
        fontWeight: '500',
    },
    amountText: {
        fontSize: 14,
        fontWeight: '700',
    },
    statusBadge: {
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        borderRadius: 24,
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
        fontWeight: '500',
    },
});
