import { CustomTabBar } from "@/components/CustomTabBar";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Common Background Area for main tab pages (except Tools which has opaque bg) */}
            <View
                style={[
                    styles.backgroundArea,
                    {
                        backgroundColor: colors.primary,
                        height: 250 + insets.top, // Covers DashboardHeader and CountdownBanner
                    },
                ]}
            />

            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                    sceneStyle: { backgroundColor: "transparent" },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Dashboard",
                    }}
                />
                <Tabs.Screen
                    name="tasks"
                    options={{
                        title: "Tasks",
                    }}
                />
                <Tabs.Screen
                    name="guests"
                    options={{
                        title: "Guests",
                    }}
                />
                <Tabs.Screen
                    name="tools"
                    options={{
                        title: "Tools",
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                    }}
                />
            </Tabs>
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
