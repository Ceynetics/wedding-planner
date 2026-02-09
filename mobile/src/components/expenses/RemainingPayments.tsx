import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface PaymentItem {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
}

export function RemainingPayments() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const payments: PaymentItem[] = [
        { id: "1", title: "Bridal Boquete", amount: 500000, dueDate: "25th Jan. 2026" },
        { id: "2", title: "Groom Suit", amount: 30000, dueDate: "28th Jan. 2026" },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <ThemedText style={styles.sectionTitle}>Remaining</ThemedText>
                <ThemedText style={styles.countText}>({payments.length} Payments)</ThemedText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {payments.map((item) => (
                    <View key={item.id} style={[styles.card, { backgroundColor: colors.expenseRedBg }]}>
                        <View style={styles.leftContent}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="credit-card-clock-outline" size={24} color={colors.expenseRed} />
                            </View>
                            <View style={styles.textContainer}>
                                <ThemedText style={styles.cardTitle} lightColor={colors.expenseRed} darkColor={colors.expenseRed}>{item.title}</ThemedText>
                                <ThemedText style={styles.dueDate} lightColor={colors.expenseRed + '99'} darkColor={colors.expenseRed + '99'}>Due : {item.dueDate}</ThemedText>
                            </View>
                        </View>
                        <ThemedText style={styles.amount} lightColor={colors.expenseRed} darkColor={colors.expenseRed}>Rs. {item.amount.toLocaleString()}</ThemedText>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 24,
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    countText: {
        fontSize: 14,
        opacity: 0.5,
        fontWeight: "500",
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    card: {
        width: 300,
        padding: 16,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        // Subtle shadow for icon
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    textContainer: {
        gap: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    dueDate: {
        fontSize: 12,
        fontWeight: "500",
    },
    amount: {
        fontSize: 16,
        fontWeight: "700",
    },
});
