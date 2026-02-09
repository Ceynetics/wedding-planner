import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../ThemedText";

interface SeatingFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onFilterPress?: () => void;
}

export function SeatingFilters({
    searchQuery,
    setSearchQuery,
    onFilterPress,
}: SeatingFiltersProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
                    <Ionicons name="search-outline" size={20} color={colors.secondary} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search Guest"
                        placeholderTextColor={colors.placeholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: colors.card }]}
                    onPress={onFilterPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="options-outline" size={22} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginTop: 20,
    },
    searchRow: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        borderRadius: 28,
        paddingHorizontal: 20,
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },
    filterButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
});
