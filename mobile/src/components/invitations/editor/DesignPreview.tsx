import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface Template {
    id: string;
    title: string;
    image: string;
}

interface DesignPreviewProps {
    templates: Template[];
    selectedTemplateId: string;
    onSelectTemplate: (id: string) => void;
}

export function DesignPreview({ templates, selectedTemplateId, onSelectTemplate }: DesignPreviewProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

    return (
        <View style={styles.container}>
            {/* Template Selector Header */}
            <View style={styles.header}>
                <ThemedText style={[styles.sectionTitle, { color: colors.emphasis || colors.primary }]}>
                    Templates
                </ThemedText>
                <TouchableOpacity>
                    <ThemedText style={[styles.viewAll, { color: colors.secondary }]}>View All</ThemedText>
                </TouchableOpacity>
            </View>

            {/* Horizontal Template List */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
            >
                {templates.slice(0, 3).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.templateItem}
                        onPress={() => onSelectTemplate(item.id)}
                    >
                        <View style={[
                            styles.thumbnailContainer,
                            { backgroundColor: colors.card },
                            selectedTemplateId === item.id && { borderColor: colors.primary, borderWidth: 2 }
                        ]}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.thumbnail}
                                contentFit="cover"
                            />
                        </View>
                        <ThemedText style={[styles.templateTitle, { color: colors.text }]}>
                            {item.title}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Large Card Preview */}
            <View style={[styles.previewContainer, { backgroundColor: colors.card }]}>
                <Image
                    source={{ uri: selectedTemplate.image }}
                    style={styles.mainImage}
                    contentFit="cover"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    horizontalScroll: {
        gap: 16,
        paddingBottom: 4,
    },
    templateItem: {
        alignItems: 'center',
        width: 100,
    },
    thumbnailContainer: {
        width: 100,
        aspectRatio: 0.75,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    templateTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    previewContainer: {
        marginTop: 30,
        width: '100%',
        aspectRatio: 0.7,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
});
