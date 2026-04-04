import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface InvitationCardProps {
    title: string;
    image?: string | number;
}

export function InvitationCard({ title, image }: InvitationCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const [imageError, setImageError] = useState(false);

    const source = typeof image === 'number' ? image : image ? { uri: image } : undefined;

    return (
        <View style={styles.container}>
            <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
                {source && !imageError ? (
                    <Image
                        source={source}
                        style={styles.image}
                        contentFit="cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View style={[styles.placeholder, { backgroundColor: colors.inputBackground }]}>
                        <Ionicons name="document-text-outline" size={32} color={colors.secondary} />
                        <ThemedText style={[styles.placeholderText, { color: colors.secondary }]}>
                            Template
                        </ThemedText>
                    </View>
                )}
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
        aspectRatio: 0.7,
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
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    placeholderText: {
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
});
