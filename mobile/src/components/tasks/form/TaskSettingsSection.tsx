import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface TaskSettingsSectionProps {
    isCompleted: boolean;
    onCompletedChange: (value: boolean) => void;
    hideFromPartner: boolean;
    onHideFromPartnerChange: (value: boolean) => void;
}

export function TaskSettingsSection({
    isCompleted,
    onCompletedChange,
    hideFromPartner,
    onHideFromPartnerChange
}: TaskSettingsSectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const switchTrackColor = {
        false: colors.paginationBg,
        true: colors.primary
    };

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                {/* Mark as Completed Toggle */}
                <View style={styles.switchRow}>
                    <View style={styles.switchTextContainer}>
                        <ThemedText type="defaultSemiBold" style={{ color: colors.emphasis }}>Mark as Completed</ThemedText>
                        <ThemedText style={[styles.switchSubtitle, { color: colors.secondary }]}>Task is already done</ThemedText>
                    </View>
                    <Switch
                        value={isCompleted}
                        onValueChange={onCompletedChange}
                        trackColor={switchTrackColor}
                        thumbColor={colors.primaryContrast}
                        ios_backgroundColor={colors.paginationBg}
                    />
                </View>

                {/* Horizontal Divider */}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Hide from Partner Toggle */}
                <View style={styles.switchRow}>
                    <View style={styles.switchTextContainer}>
                        <ThemedText type="defaultSemiBold" style={{ color: colors.emphasis }}>Hide from Partner</ThemedText>
                        <ThemedText style={[styles.switchSubtitle, { color: colors.secondary }]}>Keep this task private to you</ThemedText>
                    </View>
                    <Switch
                        value={hideFromPartner}
                        onValueChange={onHideFromPartnerChange}
                        trackColor={switchTrackColor}
                        thumbColor={colors.primaryContrast}
                        ios_backgroundColor={colors.paginationBg}
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
        paddingHorizontal: 8,
        paddingVertical: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    switchTextContainer: {
        flex: 1,
    },
    switchSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    divider: {
        height: 1,
        width: "90%",
        alignSelf: "center",
        opacity: 0.1,
    },
});
