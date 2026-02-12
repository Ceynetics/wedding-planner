import { BudgetSummary } from "@/components/expenses/BudgetSummary";
import { CategorySpendings } from "@/components/expenses/CategorySpendings";
import { ExpenseHeader } from "@/components/expenses/ExpenseHeader";
import { RecentTransactions } from "@/components/expenses/RecentTransactions";
import { RemainingPayments } from "@/components/expenses/RemainingPayments";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExpensesScreen() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    // Purple gradient matching the design (now handled by Layout)
    /* const gradientColors = (theme === "light"
        ? [colors.primary + "40", colors.primary + "10"]
        : [colors.primary + "60", colors.background]) as [string, string, ...string[]]; */

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            {/* <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.gradient, { height: 400 + insets.top }]}
            /> */}

            <ExpenseHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <BudgetSummary spent={40000} total={300000} left={150000} />

                <CategorySpendings />

                <RemainingPayments />

                <RecentTransactions />
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.emphasis }]}
                activeOpacity={0.8}
                onPress={() => router.push("/(forms)/expenses/add" as any)}
            >
                <Ionicons name="card-outline" size={28} color={colors.primaryContrast} />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
});
