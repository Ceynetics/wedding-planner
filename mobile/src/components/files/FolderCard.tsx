import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FolderCardProps {
    name: string;
    fileCount: number;
    icon: string;
    iconBgColor: string;
    iconColor: string;
}

export function FolderCard({ name, fileCount, icon, iconBgColor, iconColor }: FolderCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
                <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
            </View>
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
            <ThemedText style={styles.fileCount} lightColor={colors.secondary} darkColor={colors.secondary}>
                {fileCount} Files
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '48%',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        shadowColor: "#a1a1a1ff",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.01,
        shadowRadius: 15,
        elevation: 2,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
    },
    fileCount: {
        fontSize: 13,
        fontWeight: "600",
        marginTop: 4,
    },
});
