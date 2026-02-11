import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface CategorySelectorProps {
    chosenCategory: string;
    onSelectCategory: (category: string) => void;
}

const categories = [
    { id: 'Food', icon: 'restaurant-outline' },
    { id: 'Venue', icon: 'business-outline' },
    { id: 'Attire', icon: 'shirt-outline' },
    { id: 'Flowers', icon: 'flower-outline' },
] as const;

export function CategorySelector({ chosenCategory, onSelectCategory }: CategorySelectorProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <ThemedText style={[styles.sectionLabel, { color: colors.emphasis }]}>Choose Payment Category</ThemedText>
            <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        onPress={() => onSelectCategory(cat.id)}
                        style={[
                            styles.categoryButton,
                            { backgroundColor: chosenCategory === cat.id ? colors.primary : colors.background }
                        ]}
                    >
                        <Ionicons
                            name={cat.icon as any}
                            size={24}
                            color={chosenCategory === cat.id ? colors.primaryContrast : colors.secondary}
                        />
                        <ThemedText style={[
                            styles.categoryText,
                            { color: chosenCategory === cat.id ? colors.primaryContrast : colors.secondary }
                        ]}>
                            {cat.id}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 24,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        flex: 1,
        minWidth: 70,
        height: 80,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 8,
    },
});
