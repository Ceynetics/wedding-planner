import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface GuestCardProps {
    label: string;
    count: number;
    total: number;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
}

function GuestCard({ label, count, total, icon, iconColor }: GuestCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.cardLabel}>{label}</ThemedText>
            <View style={styles.iconWrapper}>
                <Ionicons name={icon} size={28} color={iconColor} />
            </View>
            <ThemedText style={styles.countText}>
                {count}/{total}
            </ThemedText>
        </View>
    );
}

export function GuestSummary() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.headerIconBg,
                        { backgroundColor: colors.primary + "15" },
                    ]}
                >
                    <Ionicons name="clipboard" size={18} color={colors.primary} />
                </View>
                <ThemedText style={[styles.title, { color: colors.primary }]}>
                    Guest List
                </ThemedText>
            </View>

            <View style={styles.row}>
                <GuestCard
                    label="Confirmed"
                    count={500}
                    total={1000}
                    icon="checkmark-circle"
                    iconColor={colors.success}
                />
                <GuestCard
                    label="Pending"
                    count={224}
                    total={1000}
                    icon="time"
                    iconColor={colors.warning}
                />
                <GuestCard
                    label="Declined"
                    count={225}
                    total={1000}
                    icon="close-circle"
                    iconColor={colors.error}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 10,
    },
    headerIconBg: {
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
    row: {
        flexDirection: "row",
        gap: 12,
    },
    card: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        // Floating shadow effect
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: "600",
        opacity: 0.6,
        marginBottom: 8,
    },
    iconWrapper: {
        marginBottom: 8,
    },
    countText: {
        fontSize: 13,
        fontWeight: "700",
    },
});
