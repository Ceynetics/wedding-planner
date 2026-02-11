import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface TableShapeSelectorProps {
    selectedShape: 'curved' | 'square';
    onShapeChange: (shape: 'curved' | 'square') => void;
}

export function TableShapeSelector({
    selectedShape,
    onShapeChange,
}: TableShapeSelectorProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <ThemedText style={[styles.label, { color: colors.emphasis }]}>Table Shape</ThemedText>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.shapeButton,
                        { backgroundColor: selectedShape === 'curved' ? colors.primary : colors.inputBackground }
                    ]}
                    onPress={() => onShapeChange('curved')}
                >
                    <ThemedText
                        style={[
                            styles.buttonText,
                            { color: selectedShape === 'curved' ? colors.primaryContrast : colors.secondary }
                        ]}
                    >
                        Curved
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.shapeButton,
                        { backgroundColor: selectedShape === 'square' ? colors.primary : colors.inputBackground }
                    ]}
                    onPress={() => onShapeChange('square')}
                >
                    <ThemedText
                        style={[
                            styles.buttonText,
                            { color: selectedShape === 'square' ? colors.primaryContrast : colors.secondary }
                        ]}
                    >
                        Square
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    shapeButton: {
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
