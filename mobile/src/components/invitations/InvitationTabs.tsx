import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface InvitationTabsProps {
    activeTab: "Cards" | "Editor";
    onTabChange: (tab: "Cards" | "Editor") => void;
}

export function InvitationTabs({ activeTab, onTabChange }: InvitationTabsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <TouchableOpacity
                style={[
                    styles.tab,
                    activeTab === "Cards" && { backgroundColor: theme === 'dark' ? colors.primary + "40" : colors.primary },
                ]}
                onPress={() => onTabChange("Cards")}
            >
                <ThemedText
                    style={[
                        styles.tabText,
                        activeTab === "Cards" ? { color: "#FFF" } : { color: colors.placeholder }
                    ]}
                >
                    Your Cards
                </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.tab,
                    activeTab === "Editor" && { backgroundColor: theme === 'dark' ? colors.primary + "40" : colors.primary },
                ]}
                onPress={() => onTabChange("Editor")}
            >
                <ThemedText
                    style={[
                        styles.tabText,
                        activeTab === "Editor" ? { color: "#FFF" } : { color: colors.placeholder }
                    ]}
                >
                    Editor
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: 20,
        height: 56,
        borderRadius: 50,
        padding: 6,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
    },
    tabText: {
        fontSize: 18,
        fontWeight: '700',
    },
});
