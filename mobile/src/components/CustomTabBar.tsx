import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const getIcon = (routeName: string, isFocused: boolean): keyof typeof Ionicons.glyphMap => {
        switch (routeName.toLowerCase()) {
            case "index":
            case "dashboard":
                return isFocused ? "grid" : "grid-outline";
            case "tasks":
                return isFocused ? "list" : "list-outline";
            case "guests":
                return isFocused ? "people" : "people-outline";
            case "tools":
                return isFocused ? "construct" : "construct-outline";
            case "profile":
                return isFocused ? "person" : "person-outline";
            default:
                return isFocused ? "help-circle" : "help-circle-outline";
        }
    };

    const getLabel = (routeName: string): string => {
        switch (routeName.toLowerCase()) {
            case "index":
            case "dashboard":
                return "Dashboard";
            case "tasks":
                return "Tasks";
            case "guests":
                return "Guests";
            case "tools":
                return "Tools";
            case "profile":
                return "Profile";
            default:
                return routeName;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
                <View style={styles.content}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label = options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : getLabel(route.name);

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: "tabLongPress",
                                target: route.key,
                            });
                        };

                        return (
                            <TouchableOpacity
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={styles.tabItem}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={getIcon(route.name, isFocused)}
                                    size={24}
                                    color={isFocused ? colors.primary : colors.tabIconDefault}
                                    style={styles.icon}
                                />
                                <ThemedText
                                    style={[
                                        styles.label,
                                        {
                                            color: isFocused ? colors.primary : colors.tabIconDefault,
                                            fontWeight: isFocused ? "700" : "500",
                                        },
                                    ]}
                                >
                                    {typeof label === "string" ? label : route.name}
                                </ThemedText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    safeArea: {
        paddingTop: 12,
        paddingBottom: 4,
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    icon: {
        marginBottom: 2,
    },
    label: {
        fontSize: 11,
        marginTop: 2,
    },
});
