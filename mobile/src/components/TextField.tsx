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
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        justifyContent: 'center',
    },
    input: {
        fontSize: 16,
        height: '100%',
    },
});
