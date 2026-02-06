import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CountdownItemProps {
    value: string;
    label: string;
}

function CountdownItem({ value, label }: CountdownItemProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={[styles.cardValue, { color: colors.text }]}>
                {value}
            </ThemedText>
            <ThemedText style={styles.cardLabel}>{label}</ThemedText>
        </View>
    );
}

export function CountdownBanner() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="subtitle" style={styles.title}>
                    Get Ready
                </ThemedText>
                <View style={[styles.datePill, { backgroundColor: colors.primary + "15" }]}>
                    <ThemedText style={[styles.dateText, { color: colors.primary }]}>
                        Oct 24, 2025
                    </ThemedText>
                </View>
            </View>

            <View style={styles.grid}>
                <CountdownItem value="100" label="Days" />
                <CountdownItem value="23" label="Hours" />
                <CountdownItem value="30" label="Mins" />
                <CountdownItem value="00" label="Sec" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
    },
    datePill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 12,
        fontWeight: "600",
    },
    grid: {
        flexDirection: "row",
        gap: 12,
    },
    card: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        // Floating effect
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    cardValue: {
        fontSize: 22,
        fontWeight: "800",
    },
    cardLabel: {
        fontSize: 11,
        opacity: 0.5,
        marginTop: 2,
        fontWeight: "500",
    },
});
