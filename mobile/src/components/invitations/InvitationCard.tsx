import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface InvitationCardProps {
    title: string;
    image: string;
}

export function InvitationCard({ title, image }: InvitationCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                    contentFit="cover"
                />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.7, // Vertical card feel
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
});
