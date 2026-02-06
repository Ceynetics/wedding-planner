import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../ThemedText";

interface TaskFiltersProps {
    status: "completed" | "remaining";
    setStatus: (status: "completed" | "remaining") => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onFilterPress?: () => void;
}

export function TaskFilters({
    status,
    setStatus,
    searchQuery,
    setSearchQuery,
    onFilterPress,
}: TaskFiltersProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.container, { backgroundColor: colors.primary + "10" }]}>
            {/* Status Toggle (Completed / Remaining) */}
            <View style={[styles.statusToggleContainer, { backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.2)" }]}>
                <TouchableOpacity
                    style={[
                        styles.statusButton,
                        status === "completed" && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setStatus("completed")}
                    activeOpacity={0.8}
                >
                    <ThemedText
                        style={[
                            styles.statusText,
                            status === "completed" ? { color: "#fff" } : { color: colors.secondary },
                        ]}
                    >
                        Completed
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.statusButton,
                        status === "remaining" && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setStatus("remaining")}
                    activeOpacity={0.8}
                >
                    <ThemedText
                        style={[
                            styles.statusText,
                            status === "remaining" ? { color: "#fff" } : { color: colors.secondary },
                        ]}
                    >
                        Remaining
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* Search and Filter Section */}
            <View style={styles.searchRow}>
                <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
                    <Ionicons name="search-outline" size={20} color={colors.secondary} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search tasks..."
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
        marginHorizontal: 24,
        padding: 16,
        borderRadius: 40,
        marginTop: 10,
        gap: 20,
    },
    statusToggleContainer: {
        flexDirection: "row",
        borderRadius: 30,
        padding: 4,
        height: 64,
    },
    statusButton: {
        flex: 1,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
    },
    statusText: {
        fontSize: 18,
        fontWeight: "700",
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
        paddingHorizontal: 16,
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
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
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
});
