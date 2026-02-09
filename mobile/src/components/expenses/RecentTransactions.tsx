import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TransactionItem {
    id: string;
    title: string;
    details: string;
    amount: number;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
}

export function RecentTransactions() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const transactions: TransactionItem[] = [
        { id: "1", title: "Bridal Boquete", details: "Paid by You | Bloom.com", amount: 500000, icon: "flower", color: colors.expensePink },
        { id: "2", title: "Tea Time", details: "Paid by You | Hilton.cmb", amount: 500000, icon: "food-apple", color: colors.expenseBlue },
        { id: "3", title: "Grooms Shoes", details: "Paid by You | Hameedia", amount: 500000, icon: "hanger", color: colors.expensePurple },
    ];

    return (
        <View style={styles.container}>
            <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
            <View style={styles.listContainer}>
                {transactions.map((item) => (
                    <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={styles.leftContent}>
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                                <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                            </View>
                            <View style={styles.textContainer}>
                                <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                                <ThemedText style={styles.details}>{item.details}</ThemedText>
                            </View>
                        </View>
                        <ThemedText style={styles.amount}>-Rs. {item.amount.toLocaleString()}</ThemedText>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    listContainer: {
        gap: 12,
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 20,
        // Suble shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
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
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        gap: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    details: {
        fontSize: 12,
        opacity: 0.5,
        fontWeight: "500",
    },
    amount: {
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
});
