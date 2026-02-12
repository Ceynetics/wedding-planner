import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface CountdownItemProps {
    value: string;
    label: string;
}

function CountdownItem({ value, label }: CountdownItemProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.countdownCard, { backgroundColor: colors.background }]}>
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
            {/* Floating card container */}
            <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>

                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <ThemedText type="subtitle" style={styles.title}>
                            Get Ready
                        </ThemedText>
                        <View style={[styles.datePill, { backgroundColor: colors.primary + "15" }]}>
                            <ThemedText style={[styles.dateText, { color: colors.primary }]}>
                                October 24, 2025
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.grid}>
                        <CountdownItem value="100" label="Days" />
                        <CountdownItem value="23" label="Hrs" />
                        <CountdownItem value="30" label="Mins" />
                    </View>
                </View>

                <Image
                    source={require("../../../assets/icons/couple.png")}
                    style={styles.coupleImage}
                    resizeMode="contain"
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginTop: -60,
        marginBottom: 24,
        zIndex: 2,
    },
    cardContainer: {
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // Premium floating shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
        minHeight: 160,
    },
    contentContainer: {
        flex: 1,
        paddingRight: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
    },
    datePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 12,
        fontWeight: "600",
    },
    grid: {
        flexDirection: "row",
        gap: 10,
    },
    coupleImage: {
        width: 200,
        height: 200,
        marginBottom: -20, // Align closer to bottom edge
        marginRight: -50, // Slight visual bleed
    },
    countdownCard: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 12,
        minWidth: 55,
        // Soft Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: "800",
        lineHeight: 24,
    },
    cardLabel: {
        fontSize: 10,
        opacity: 0.6,
        fontWeight: "600",
        textTransform: "uppercase",
    },
});
