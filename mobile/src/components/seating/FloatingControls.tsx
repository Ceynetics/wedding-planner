import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface FloatingControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onAddTable: () => void;
    onChangeShape: () => void;
}

/**
 * FloatingControls - A set of interactive buttons for managing the floor plan view.
 * Positioned fixed at the bottom right.
 */
export const FloatingControls: React.FC<FloatingControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onAddTable,
    onChangeShape
}) => {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Add Table Button - Primary Action */}
            <TouchableOpacity
                style={[styles.button, styles.primaryButton, { backgroundColor: '#21003D' }]}
                onPress={onAddTable}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
            </TouchableOpacity>

            {/* View Manipulation Controls */}
            <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.groupButton} onPress={onZoomIn}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <TouchableOpacity style={styles.groupButton} onPress={onZoomOut}>
                    <MaterialCommunityIcons name="minus-circle-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <TouchableOpacity style={styles.groupButton} onPress={onChangeShape}>
                    <MaterialCommunityIcons name="shape-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        right: 24,
        alignItems: 'center',
        gap: 16,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButton: {
        marginBottom: 4,
    },
    group: {
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    groupButton: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        width: '60%',
        alignSelf: 'center',
    },
});
