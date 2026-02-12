import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface TableCardProps {
    name: string;
    description: string;
    currentGuests: number;
    maxGuests: number;
    isVip?: boolean;
}

export function TableCard({ name, description, currentGuests, maxGuests, isVip }: TableCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const progress = Math.min(currentGuests / maxGuests, 1);

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
                <View style={styles.leftInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                        <MaterialCommunityIcons name="table-furniture" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                            <ThemedText style={styles.name}>{name}</ThemedText>
                            {isVip && (
                                <MaterialCommunityIcons name="crown" size={18} color="#FFB000" style={styles.vipIcon} />
                            )}
                        </View>
                        <ThemedText style={styles.description} lightColor={colors.secondary} darkColor={colors.secondary}>
                            {description}
                        </ThemedText>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.secondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarTrack, { backgroundColor: theme === 'light' ? '#E2E8F0' : '#334155' }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progress * 100}%`,
                                    backgroundColor: colors.primary
                                }
                            ]}
                        />
                    </View>
                    <ThemedText style={styles.statusText} lightColor={colors.secondary} darkColor={colors.secondary}>
                        {currentGuests}/{maxGuests} Guests
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    leftInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
    },
    vipIcon: {
        marginTop: -2,
    },
    description: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
    },
    menuButton: {
        padding: 4,
    },
    progressSection: {
        marginTop: 16,
    },
    progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    progressBarTrack: {
        flex: 1,
        height: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 5,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "600",
        minWidth: 75,
        textAlign: "right",
    },
});
