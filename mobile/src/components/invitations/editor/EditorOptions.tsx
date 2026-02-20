import React from 'react';
import { StyleSheet, View, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { PrimaryButton } from '@/components/PrimaryButton';

interface EditorOptionsProps {
    selectedColor: string;
    onColorSelect: (color: string) => void;
    isVip: boolean;
    onVipChange: (value: boolean) => void;
    onExport: () => void;
    onShare: () => void;
}

const VARIANTS = [
    '#E74C3C', // Red
    '#58D68D', // Green
    '#2E86C1', // Blue
    '#D2B4DE', // Lavender
    '#A9DFBF', // Light Green
    '#707B7C', // Gray
];

export function EditorOptions({
    selectedColor,
    onColorSelect,
    isVip,
    onVipChange,
    onExport,
    onShare,
}: EditorOptionsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Color Variants */}
            <ThemedText style={[styles.sectionTitle, { color: colors.emphasis || colors.primary }]}>
                Color Variants
            </ThemedText>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.colorRow}>
                    {VARIANTS.map((color) => (
                        <TouchableOpacity
                            key={color}
                            style={[
                                styles.colorCircle,
                                { backgroundColor: color },
                                selectedColor === color && { borderColor: colors.primary, borderWidth: 3 }
                            ]}
                            onPress={() => onColorSelect(color)}
                        />
                    ))}
                </View>
            </View>

            {/* VIP Switch */}
            <View style={[styles.card, styles.vipCard, { backgroundColor: colors.card }]}>
                <View style={styles.vipContent}>
                    <MaterialCommunityIcons name="crown" size={24} color="#FFB000" />
                    <ThemedText style={[styles.vipText, { color: colors.emphasis || colors.primary }]}>
                        Mark as VIP
                    </ThemedText>
                </View>
                <Switch
                    value={isVip}
                    onValueChange={onVipChange}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.primaryContrast}
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.secondaryButton, { backgroundColor: colors.inputBackground }]}
                    onPress={onExport}
                >
                    <ThemedText style={[styles.buttonText, { color: colors.emphasis || colors.primary }]}>
                        Export PDF
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={onShare}
                >
                    <ThemedText style={[styles.buttonText, { color: '#FFF' }]}>
                        Share
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    vipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    vipContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    vipText: {
        fontSize: 16,
        fontWeight: '700',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12,
    },
    secondaryButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
