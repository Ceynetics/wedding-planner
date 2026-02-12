import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface MarkAsVipProps {
    isVip: boolean;
    onVipChange: (enabled: boolean) => void;
}

export function MarkAsVip({
    isVip,
    onVipChange,
}: MarkAsVipProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const switchTrackColor = {
        false: theme === 'dark' ? colors.secondary : colors.border,
        true: colors.primary
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="crown" size={24} color={colors.warning} />
                <ThemedText style={[styles.label, { color: colors.emphasis }]}>
                    Mark as VIP
                </ThemedText>
            </View>
            <Switch
                value={isVip}
                onValueChange={onVipChange}
                trackColor={switchTrackColor}
                thumbColor={colors.primaryContrast}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
    },
});
