import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface NotificationItemProps {
    id: string;
    title: string;
    description: string;
    type: "payment" | "rsvp" | "alert" | "general";
    isRead: boolean;
}

export function NotificationItem({ title, description, type, isRead }: NotificationItemProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const getIconConfig = () => {
        switch (type) {
            case "payment":
                return {
                    name: "wallet-outline" as const,
                    color: colors.expensePurple,
                    bg: colors.expensePurple + "15"
                };
            case "rsvp":
                return {
                    name: "email-check-outline" as const,
                    color: colors.success,
                    bg: colors.success + "15"
                };
            case "alert":
                return {
                    name: "bell-alert-outline" as const,
                    color: colors.expensePink,
                    bg: colors.expensePink + "15"
                };
            default:
                return {
                    name: "information-outline" as const,
                    color: colors.primary,
                    bg: colors.primary + "15"
                };
        }
    };

    const config = getIconConfig();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
                <MaterialCommunityIcons name={config.name} size={24} color={config.color} />
            </View>

            <View style={styles.textContainer}>
                <ThemedText style={styles.title} numberOfLines={1}>{title}</ThemedText>
                <ThemedText
                    style={styles.description}
                    lightColor={colors.secondary}
                    darkColor={colors.secondary}
                    numberOfLines={1}
                >
                    {description}
                </ThemedText>
            </View>

            <TouchableOpacity style={styles.menuButton}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.secondary} />
            </TouchableOpacity>

            {!isRead && (
                <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    description: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
    },
    menuButton: {
        padding: 4,
    },
    unreadDot: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});
