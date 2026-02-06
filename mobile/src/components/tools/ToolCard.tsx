import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ToolCardProps {
    title: string;
    subtitle: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void;
}

export function ToolCard({ title, subtitle, icon, onPress }: ToolCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <ThemedText style={styles.title}>{title}</ThemedText>

            <View style={[styles.iconContainer, { backgroundColor: theme === 'light' ? colors.primary + '10' : colors.primary + '20' }]}>
                <MaterialCommunityIcons name={icon} size={60} color={colors.primary} />
                <ThemedText style={styles.placeholderLabel}>Image Placeholder</ThemedText>
            </View>

            <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                {subtitle}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 24,
        padding: 20,
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 280,
        // Premium shadow matching the design
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
    },
    iconContainer: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
    },
    placeholderLabel: {
        fontSize: 10,
        opacity: 0.5,
        marginTop: 5,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "500",
        lineHeight: 20,
    },
});
