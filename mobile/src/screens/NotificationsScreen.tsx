import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationItem, NotificationItemProps } from "@/components/notifications/NotificationItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationGroup {
    title: string;
    data: NotificationItemProps[];
}

const MOCK_NOTIFICATIONS: NotificationGroup[] = [
    {
        title: "Today",
        data: [
            {
                id: "1",
                title: "Hotel Payments",
                description: "module | Task | Time",
                type: "payment",
                isRead: false,
            },
            {
                id: "2",
                title: "Sara Accepted",
                description: "RSVP | Invitation Accepted | 4 hrs Ago",
                type: "rsvp",
                isRead: true,
            },
            {
                id: "3",
                title: "Flowers Payment",
                description: "Payments | Due Tomorrow | 3 mins Ago",
                type: "alert",
                isRead: false,
            },
        ],
    },
    {
        title: "Yesterday",
        data: [
            {
                id: "4",
                title: "Hotel Payments",
                description: "module | Task | Time",
                type: "payment",
                isRead: true,
            },
            {
                id: "5",
                title: "Sara Accepted",
                description: "RSVP | Invitation Accepted | 4 hrs Ago",
                type: "rsvp",
                isRead: true,
            },
            {
                id: "6",
                title: "Flowers Payment",
                description: "Payments | Due Tomorrow | 3 mins Ago",
                type: "alert",
                isRead: true,
            },
        ],
    },
];

export default function NotificationsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [activeFilter, setActiveFilter] = useState("all");

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

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.notificationList}>
                    {MOCK_NOTIFICATIONS.map((group, index) => (
                        <View key={index} style={styles.groupContainer}>
                            <ThemedText style={styles.groupHeader}>{group.title}</ThemedText>
                            {group.data.map((item) => (
                                <NotificationItem key={item.id} {...item} />
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
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
});
