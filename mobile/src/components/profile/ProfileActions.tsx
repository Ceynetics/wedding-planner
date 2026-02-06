import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ProfileActionsProps {
    onLogoutPress?: () => void;
    onDeleteEventPress?: () => void;
}

export function ProfileActions({ onLogoutPress, onDeleteEventPress }: ProfileActionsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: colors.primary + "15" }]}
                onPress={onLogoutPress}
                activeOpacity={0.7}
            >
                <ThemedText style={[styles.logoutText, { color: colors.primary }]}>Log Out</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.deleteButton, { borderColor: colors.error }]}
                onPress={onDeleteEventPress}
                activeOpacity={0.7}
            >
                <ThemedText style={[styles.deleteText, { color: colors.error }]}>Delete Event</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginTop: 32,
        gap: 16,
        paddingBottom: 40,
    },
    logoutButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "700",
    },
    deleteButton: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    deleteText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
