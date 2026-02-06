import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function GuestHeader() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    // Use primary color based gradient that respects the theme, matching TaskHeader.tsx
    const gradientColors = (theme === "light"
        ? [colors.primary + "40", colors.primary + "10"] // Soft primary gradient
        : [colors.primary + "60", colors.background]) as [string, string, ...string[]];

    return (
        <View style={styles.outerContainer}>
            {/* <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.gradient, { height: 220 + insets.top }]}
            /> */}

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
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
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
