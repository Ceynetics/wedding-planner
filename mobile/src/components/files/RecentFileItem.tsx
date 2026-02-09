import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface RecentFileItemProps {
    name: string;
    module: string;
    size: string;
}

export function RecentFileItem({ name, module, size }: RecentFileItemProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: colors.card }]} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                <MaterialCommunityIcons name="file-pdf-box" size={24} color={colors.primary} />
            </View>

            <View style={styles.textContainer}>
                <ThemedText style={styles.name}>{name}</ThemedText>
                <ThemedText style={styles.meta} lightColor={colors.secondary} darkColor={colors.secondary}>
                    {module} | {size}
                </ThemedText>
            </View>

            <TouchableOpacity style={styles.menuButton}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.secondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 20,
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
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
    },
    meta: {
        fontSize: 13,
        fontWeight: "500",
        marginTop: 2,
    },
    menuButton: {
        padding: 4,
    },
});
