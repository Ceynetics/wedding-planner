import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface TaskSettingsSectionProps {
    isCompleted: boolean;
    onCompletedChange: (value: boolean) => void;
}

export function TaskSettingsSection({
    isCompleted,
    onCompletedChange
}: TaskSettingsSectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const switchTrackColor = {
        false: theme === 'dark' ? colors.secondary : colors.border,
        true: colors.primary
    };

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.switchRow}>
                    <View style={styles.switchTextContainer}>
                        <ThemedText type="defaultSemiBold" style={{ color: colors.emphasis }}>Mark as Completed</ThemedText>
                        <ThemedText style={[styles.switchSubtitle, { color: colors.placeholder }]}>Task is already done</ThemedText>
                    </View>
                    <Switch
                        value={isCompleted}
                        onValueChange={onCompletedChange}
                        trackColor={switchTrackColor}
                        thumbColor={colors.primaryContrast}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    switchTextContainer: {
        flex: 1,
    },
    switchSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
});
