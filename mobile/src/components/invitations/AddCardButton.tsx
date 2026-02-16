import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

export function AddCardButton() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: colors.primary + "10",
                        borderColor: colors.primary + "40"
                    }
                ]}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Ionicons name="document-text" size={24} color={colors.primary} />
                </View>
                <ThemedText style={[styles.label, { color: colors.primary }]}>Add New</ThemedText>
            </TouchableOpacity>
            <View style={{ height: 26 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    button: {
        width: '100%',
        aspectRatio: 0.7,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
    },
});
