import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, useWindowDimensions } from "react-native";

interface PaymentItem {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
}

export function RemainingPayments() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const { width } = useWindowDimensions();
    const router = useRouter();
    
    // Scale card dynamically to fit cleanly on screen while maxing out safely around 340px
    const cardWidth = Math.min(width * 0.85, 340);

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
                    <View key={item.id} style={[styles.card, { width: cardWidth, backgroundColor: colors.card }]}>
                        <View style={styles.topRow}>
                            <View style={styles.leftContent}>
                                <View style={[styles.iconContainer, { backgroundColor: colors.expenseRed + '15' }]}>
                                    <MaterialCommunityIcons name="credit-card-clock-outline" size={24} color={colors.expenseRed} />
                                </View>
                                <View style={styles.textContainer}>
                                    <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.amount}>
                                Rs. {item.amount.toLocaleString()}
                            </ThemedText>
                        </View>
                        
                        {/* Bottom Row: Due Date details mapped left, with inline edit/delete actions right */}
                        <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
                            <View style={styles.dueDateContainer}>
                                <MaterialCommunityIcons name="calendar-clock-outline" size={16} color={colors.text} style={{ opacity: 0.5 }} />
                                <ThemedText style={[styles.dueDate, { opacity: 0.5 }]}>Due: {item.dueDate}</ThemedText>
                            </View>
                            
                            <View style={styles.actionGroup}>
                                <TouchableOpacity style={styles.iconAction}>
                                    <MaterialCommunityIcons name="trash-can-outline" size={22} color={colors.error} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.editButton, { backgroundColor: colors.expenseRed + '15' }]}
                                    onPress={() => router.push({ pathname: "/(forms)/expenses/edit", params: { id: item.id } } as any)}
                                >
                                    <ThemedText style={[styles.editText, { color: colors.expenseRed }]}>
                                        Edit
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
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
        // Dynamic width managed natively via useWindowDimensions
        padding: 16,
        borderRadius: 20,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1, // Enforce flexible text bounds to avoid blocking the amount
        marginRight: 10,
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
        flex: 1,
        gap: 2,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        marginTop: 16,
        paddingTop: 12,
    },
    dueDateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    actionGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconAction: {
        padding: 4,
    },
    editButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10,
    },
    editText: {
        fontSize: 14,
        fontWeight: "700",
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
