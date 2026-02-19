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

interface HiredFiltersProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

export function HiredFilters({
    activeFilter,
    setActiveFilter,
}: HiredFiltersProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const filters = [
        { id: "all", label: "All Vendors" },
        { id: "filter2", label: "Hotels" },
        { id: "filter3", label: "Caterers" },
        { id: "filter4", label: "Photographers" },
        { id: "filter5", label: "Florists" },
        { id: "filter6", label: "Decorators" },
        { id: "filter7", label: "DJ" },
        { id: "filter8", label: "Makeup Artists" },
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
                                    backgroundColor: isActive ? colors.primary : colors.card,
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
        marginTop: 20,
        marginBottom: 20,
    },
    filterScroll: {
        paddingHorizontal: 24,
        gap: 12,
        paddingBottom: 4,
    },
    filterPill: {
        paddingHorizontal: 28,
        height: 48,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
    },
    filterText: {
        fontSize: 15,
        fontWeight: "600",
    },
});
