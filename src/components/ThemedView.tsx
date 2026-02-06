import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
    const { theme } = useAppTheme();
    const backgroundColor = theme === 'light' ? (lightColor || Colors.light.background) : (darkColor || Colors.dark.background);

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
