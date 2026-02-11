import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View
} from 'react-native';

interface TextFieldProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function TextField({ label, error, style, ...props }: TextFieldProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {label && (
                <ThemedText type="label">{label}</ThemedText>
            )}
            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: colors.inputBackground,
                    borderColor: error ? colors.error : 'transparent',
                }
            ]}>
                <TextInput
                    placeholderTextColor={colors.placeholder}
                    style={[
                        styles.input,
                        { color: colors.text },
                        style
                    ]}
                    {...props}
                />
            </View>
            {error && (
                <ThemedText type="error">{error}</ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    inputContainer: {
        minHeight: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12, // Added for better multiline spacing
        borderWidth: 1,
    },
    input: {
        fontSize: 16,
        flex: 1,
    },
});
