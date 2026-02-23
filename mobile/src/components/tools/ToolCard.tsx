import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";

interface ToolCardProps {
    title: string;
    subtitle: string;
    imageSource: ImageSourcePropType;
    onPress: () => void;
}

export function ToolCard({ title, subtitle, imageSource, onPress }: ToolCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.content}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                    {subtitle}
                </ThemedText>
            </View>

            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 10,
        minHeight: 220,
        position: "relative",
        overflow: "hidden",
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 10 },
        // shadowOpacity: 0.05,
        // shadowRadius: 15,
        // elevation: 2,
    },
    content: {
        padding: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 20,
    },
    image: {
        position: "absolute",
        bottom: -60,
        right: -60,
        width: 200,
        height: 200,
        opacity: 1,
    },
});
