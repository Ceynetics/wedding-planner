import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';

interface TextFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
}

export function TextField({
    label,
    error,
    style,
    leftIcon,
    rightIcon,
    labelStyle,
    containerStyle,
    inputContainerStyle,
    ...props
}: TextFieldProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <ThemedText type="label" style={labelStyle}>{label}</ThemedText>
            )}
            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: colors.inputBackground,
                    borderColor: error ? colors.error : 'transparent',
                },
                inputContainerStyle
            ]}>
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <TextInput
                    placeholderTextColor={colors.placeholder}
                    style={[
                        styles.input,
                        { color: colors.text },
                        style
                    ]}
                    {...props}
                />
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
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
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    input: {
        fontSize: 16,
        flex: 1,
        height: '100%',
        paddingVertical: 12,
    },
    iconLeft: {
        marginRight: 12,
    },
    iconRight: {
        marginLeft: 12,
    },
});
