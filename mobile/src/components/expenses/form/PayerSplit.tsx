import React from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface PayerSplitProps {
    paidBy: 'Me' | 'Partner';
    onPaidByChange: (payer: 'Me' | 'Partner') => void;
    splitEnabled: boolean;
    onSplitChange: (enabled: boolean) => void;
}

export function PayerSplit({
    paidBy,
    onPaidByChange,
    splitEnabled,
    onSplitChange,
}: PayerSplitProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const labelStyle = {
        color: colors.emphasis,
        fontSize: 18,
        fontWeight: '700' as const,
        marginBottom: 12,
        opacity: 1
    };

    const switchTrackColor = {
        false: theme === 'dark' ? colors.secondary : colors.border,
        true: colors.primary
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={[styles.sectionLabel, { color: colors.emphasis }]}>Payer & Split</ThemedText>

            <View style={styles.section}>
                <ThemedText style={[styles.label, { color: colors.placeholder }]}>Paid by</ThemedText>
                <View style={[styles.toggleContainer, { backgroundColor: colors.inputBackground }]}>
                    <TouchableOpacity
                        onPress={() => onPaidByChange('Me')}
                        style={[
                            styles.toggleButton,
                            paidBy === 'Me' && { backgroundColor: colors.primary }
                        ]}
                    >
                        <ThemedText style={[
                            styles.toggleText,
                            { color: paidBy === 'Me' ? colors.primaryContrast : colors.placeholder }
                        ]}>Me</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onPaidByChange('Partner')}
                        style={[
                            styles.toggleButton,
                            paidBy === 'Partner' && { backgroundColor: colors.primary }
                        ]}
                    >
                        <ThemedText style={[
                            styles.toggleText,
                            { color: paidBy === 'Partner' ? colors.primaryContrast : colors.placeholder }
                        ]}>Partner</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                    <ThemedText style={[styles.splitTitle, { color: colors.emphasis }]}>Split the Bill</ThemedText>
                    <ThemedText style={[styles.splitSubtitle, { color: colors.placeholder }]}>Split the bill 50/50</ThemedText>
                </View>
                <Switch
                    value={splitEnabled}
                    onValueChange={onSplitChange}
                    trackColor={switchTrackColor}
                    thumbColor={colors.primaryContrast}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    toggleContainer: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '700',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    switchTextContainer: {
        flex: 1,
    },
    splitTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    splitSubtitle: {
        fontSize: 14,
        fontWeight: '500',
    },
});
