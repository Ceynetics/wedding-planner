import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    View,
} from 'react-native';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: string;
}

export function PrimaryButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon
}: PrimaryButtonProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                { backgroundColor: colors.primary },
                (disabled || loading) && { opacity: 0.7 },
                style
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.primaryContrast} />
            ) : (
                <View style={styles.content}>
                    {icon && (
                        <Ionicons
                            name={icon as any}
                            size={20}
                            color={colors.primaryContrast}
                            style={styles.icon}
                        />
                    )}
                    <Text style={[styles.text, { color: colors.primaryContrast }, textStyle]}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
