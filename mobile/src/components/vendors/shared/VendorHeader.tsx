import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VendorHeaderProps {
    activeTab: "discover" | "hired";
    setActiveTab: (tab: "discover" | "hired") => void;
}

export function VendorHeader({ activeTab, setActiveTab }: VendorHeaderProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const headerHeight = 220 + insets.top;

    return (
        <View style={[styles.container, { height: headerHeight, paddingTop: insets.top + 10 }]}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <ThemedText style={styles.title}>Vendors</ThemedText>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card }]}>
                        <Ionicons name="document-attach-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card }]}>
                        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tab Switcher - Centered in remaining area */}
            <View style={styles.tabWrapper}>
                <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "discover" && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => setActiveTab("discover")}
                        activeOpacity={0.8}
                    >
                        <ThemedText
                            style={[
                                styles.tabText,
                                { color: activeTab === "discover" ? colors.primaryContrast : colors.secondary }
                            ]}
                        >
                            Discover
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "hired" && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => setActiveTab("hired")}
                        activeOpacity={0.8}
                    >
                        <ThemedText
                            style={[
                                styles.tabText,
                                { color: activeTab === "hired" ? colors.primaryContrast : colors.secondary }
                            ]}
                        >
                            Hired
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        zIndex: 10,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    tabWrapper: {
        flex: 1,
        justifyContent: "center",
        paddingBottom: 20, // Push up slightly to look centered relative to whole blue area
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    tabContainer: {
        flexDirection: "row",
        padding: 6,
        borderRadius: 32,
        height: 64,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    tab: {
        flex: 1,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
    },
    tabText: {
        fontSize: 18,
        fontWeight: "700",
    },
});
