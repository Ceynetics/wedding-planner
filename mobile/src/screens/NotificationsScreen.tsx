import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationItem, NotificationItemProps } from "@/components/notifications/NotificationItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useNotifications } from "@/hooks/useNotifications";
import { displayEnum } from "@/utils/enums";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import type { NotificationType } from "@/types/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationGroup {
    title: string;
    data: NotificationItemProps[];
}

/** Map a filter tab ID to a NotificationType for the API (or undefined for "all"/"unread"). */
const FILTER_TYPE_MAP: Record<string, NotificationType | undefined> = {
    all: undefined,
    unread: undefined,
    tasks: "TASK",
    payments: "PAYMENT",
    guests: "RSVP",
    vendors: "EVENT",
};

/** Group a date string into a human-readable bucket label. */
function getDateGroupLabel(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (d.getTime() === today.getTime()) return "Today";
    if (d.getTime() === yesterday.getTime()) return "Yesterday";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function NotificationsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();

    const [activeFilter, setActiveFilter] = useState("all");

    // Re-fetch when the filter tab changes
    useEffect(() => {
        const type = FILTER_TYPE_MAP[activeFilter];
        fetchNotifications(type ? { type } : undefined);
    }, [activeFilter, fetchNotifications]);

    // Group notifications by date, applying client-side "unread" filter
    const groupedNotifications: NotificationGroup[] = useMemo(() => {
        const filtered = activeFilter === "unread"
            ? notifications.filter((n) => !n.isRead)
            : notifications;

        const groups: Record<string, NotificationItemProps[]> = {};
        for (const n of filtered) {
            const label = getDateGroupLabel(n.createdAt);
            if (!groups[label]) groups[label] = [];
            groups[label].push({
                id: String(n.id),
                title: n.title,
                description: n.description || (n.type ? displayEnum(n.type) : ""),
                type: (n.type?.toLowerCase() as NotificationItemProps["type"]) ?? "general",
                isRead: n.isRead,
                onPress: () => markAsRead(n.id),
            });
        }
        return Object.entries(groups).map(([title, data]) => ({ title, data }));
    }, [notifications, activeFilter, markAsRead]);

    const headerHeight = 200 + insets.top;

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Theme Background Area */}
            <LinearGradient
                colors={[colors.primary, colors.background]}
                style={[styles.backgroundArea, { height: headerHeight }]}
            />

            <NotificationHeader onClose={() => router.back()} />

            <NotificationFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />

            {isLoading && notifications.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.notificationList}>
                        {groupedNotifications.map((group, index) => (
                            <View key={index} style={styles.groupContainer}>
                                <ThemedText style={styles.groupHeader}>{group.title}</ThemedText>
                                {group.data.map((item) => (
                                    <NotificationItem key={item.id} {...item} />
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundArea: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    notificationList: {
        paddingHorizontal: 24,
    },
    groupContainer: {
        marginBottom: 24,
    },
    groupHeader: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 16,
        opacity: 0.9,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
