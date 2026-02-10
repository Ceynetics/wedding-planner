import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface NotificationFiltersProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

export function NotificationFilters({
    activeFilter,
    setActiveFilter,
}: NotificationFiltersProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const filters = [
        { id: "all", label: "All" },
        { id: "unread", label: "Unread" },
        { id: "tasks", label: "Tasks" },
        { id: "payments", label: "Payments" },
        { id: "guests", label: "Guests" },
        { id: "vendors", label: "Vendors" },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
            >
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.id;
                    return (
                        <TouchableOpacity
                            key={filter.id}
                            onPress={() => setActiveFilter(filter.id)}
                            style={[
                                styles.filterPill,
                                {
                                    backgroundColor: isActive ? colors.expensePurple : colors.card,
                                },
                            ]}
                        >
                            <ThemedText
                                style={[
                                    styles.filterText,
                                    {
                                        color: isActive ? colors.primaryContrast : colors.secondary,
                                    },
                                ]}
                            >
                                {filter.label}
                            </ThemedText>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    filterScroll: {
        paddingHorizontal: 24,
        gap: 12,
        paddingBottom: 4,
    },
    filterPill: {
        paddingHorizontal: 28,
        height: 48,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
    },
    filterText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
