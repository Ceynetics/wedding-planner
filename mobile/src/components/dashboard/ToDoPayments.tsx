import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface PaymentItem {
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    icon: keyof typeof Ionicons.glyphMap;
}

interface ToDoPaymentsProps {
    payments: PaymentItem[];
    onPaymentPress?: (payment: PaymentItem) => void;
    currency?: string;
}

export function ToDoPayments({
    payments,
    onPaymentPress,
    currency = "Rs.",
}: ToDoPaymentsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: colors.primary + "15" },
                    ]}
                >
                    <Ionicons name="wallet" size={18} color={colors.primary} />
                </View>
                <ThemedText style={[styles.title, { color: colors.primary }]}>
                    To-Do Payments
                </ThemedText>
            </View>

            <View style={styles.list}>
                {payments.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.paymentItem,
                            { backgroundColor: colors.background },
                        ]}
                        onPress={() => onPaymentPress?.(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.leftSection}>
                            <View style={[styles.paymentIconBg, { backgroundColor: colors.card }]}>
                                <Ionicons name={item.icon} size={20} color={colors.primary} />
                            </View>
                            <View style={styles.textDetails}>
                                <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
                                <ThemedText style={styles.itemSubtitle}>{item.subtitle}</ThemedText>
                            </View>
                        </View>
                        <ThemedText style={styles.amountText}>
                            {currency}{item.amount.toLocaleString()}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 24,
        // Premium floating effect
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        gap: 10,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    list: {
        gap: 12,
    },
    paymentItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 16,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    paymentIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    textDetails: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: "600",
    },
    itemSubtitle: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 2,
    },
    amountText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
