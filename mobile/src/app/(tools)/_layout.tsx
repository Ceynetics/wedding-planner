import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function ToolsLayout() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    const headerHeight = 220 + insets.top;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Common Background Area for all tool pages */}
            <LinearGradient
                colors={[colors.primary, "transparent"]}
                style={[
                    styles.backgroundArea,
                    {
                        height: headerHeight,
                    },
                ]}
            />

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    animation: "slide_from_right",
                }}
            >
                <Stack.Screen name="expenses" />
                <Stack.Screen name="seating/index" />
                <Stack.Screen name="seating/[id]" />
                <Stack.Screen name="vendors" />
                <Stack.Screen name="invitations" />
                <Stack.Screen name="calendar" />
                <Stack.Screen name="files" />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundArea: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
});
