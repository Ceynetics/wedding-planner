import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function GuestHeader() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.outerContainer}>
            {/* Background is now handled by layout */}

            <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
                <View style={styles.textContainer}>
                    <ThemedText style={styles.title}>
                        Guests
                    </ThemedText>
                </View>

                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: colors.card }]}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="download-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: colors.card }]}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        position: "relative",
        width: "100%",
        marginBottom: -30,
    },
    backgroundArea: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        paddingHorizontal: 24,
        paddingBottom: 50,
        zIndex: 1,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 34,
        fontWeight: "800",
        letterSpacing: -0.5,
        lineHeight: 42,
    },
    actionContainer: {
        flexDirection: "row",
        gap: 12,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        // Premium shadow matching DashboardHeader
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
});
