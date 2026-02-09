import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ExpenseHeader() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <ThemedText style={styles.title}>Expenses</ThemedText>
            </View>

            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card }]}>
                <Ionicons name="document-attach-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 20,
        zIndex: 10,
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
});
