import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

export interface ProfileMenuItem {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    type?: 'link' | 'switch';
    value?: boolean;
    onValueChange?: (value: boolean) => void;
}

interface ProfileMenuSectionProps {
    title: string;
    items: ProfileMenuItem[];
}

export function ProfileMenuSection({ title, items }: ProfileMenuSectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
            <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
                {items.map((item, index) => (
                    <View key={item.id}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={item.type === 'switch' ? undefined : item.onPress}
                            disabled={item.type === 'switch'}
                            activeOpacity={0.6}
                        >
                            <View style={styles.leftSection}>
                                <View style={[styles.iconWrapper, { backgroundColor: colors.primary + "15" }]}>
                                    <Ionicons name={item.icon} size={20} color={colors.primary} />
                                </View>
                                <ThemedText style={styles.label}>{item.label}</ThemedText>
                            </View>

                            {item.type === 'switch' ? (
                                <Switch
                                    value={item.value}
                                    onValueChange={item.onValueChange}
                                    trackColor={{ false: colors.border, true: colors.primary + "60" }}
                                    thumbColor={item.value ? colors.primary : colors.tabIconDefault}
                                />
                            ) : (
                                <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} style={{ opacity: 0.5 }} />
                            )}
                        </TouchableOpacity>
                        {index < items.length - 1 && (
                            <View style={[styles.separator, { backgroundColor: colors.border + "50" }]} />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
        opacity: 0.8,
    },
    menuContainer: {
        borderRadius: 24,
        overflow: "hidden",
        // Floating effect
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
    },
    separator: {
        height: 1,
        marginHorizontal: 16,
    },
});
