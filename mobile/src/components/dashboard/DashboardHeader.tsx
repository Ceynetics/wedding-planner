import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DashboardHeaderProps {
    userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.outerContainer}>
            {/* Background is now handled by layout */}

            <View style={[styles.container]}>
                <View style={styles.textContainer}>
                    <ThemedText style={styles.welcomeText}>Welcome,</ThemedText>
                    <ThemedText type="title" style={styles.userName}>
                        {userName}
                    </ThemedText>
                </View>

                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: colors.card }]}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="calendar-clear" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: colors.card }]}
                        activeOpacity={0.7}
                        onPress={() => router.push("/notifications")}
                    >
                        <Ionicons name="notifications" size={24} color={colors.primary} />
                        <View style={[styles.badge, { backgroundColor: colors.error }]} />
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
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 140, // Increased to prevent overlap with countdown
        zIndex: 1,
    },
    textContainer: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 18,
        opacity: 0.9, // Increased opacity for better visibility
        fontWeight: "500",
    },
    userName: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: -4,
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
        // Premium floating effect
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    badge: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "#fff",
    },
});
