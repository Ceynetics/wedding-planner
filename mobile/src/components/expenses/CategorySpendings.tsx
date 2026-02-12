import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { Image, ImageSourcePropType, ScrollView, StyleSheet, View } from "react-native";

interface CategoryItem {
    id: string;
    title: string;
    amount: number;
    imageSource: ImageSourcePropType;
}

export function CategorySpendings() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    // Using a unified grey-ish color from constants
    const unifiedColor = colors.secondary;

    const categories: CategoryItem[] = [
        {
            id: "1",
            title: "Attire",
            amount: 50000,
            imageSource: require("../../../assets/icons/attire.png")
        },
        {
            id: "2",
            title: "Flowers",
            amount: 13000,
            imageSource: require("../../../assets/icons/floral.png")
        },
        {
            id: "3",
            title: "Catering",
            amount: 75000,
            imageSource: require("../../../assets/icons/food.png")
        },

        {
            id: "4",
            title: "Venue",
            amount: 500000,
            imageSource: require("../../../assets/icons/venue.png")
        },


    ];

    return (
        <View style={styles.container}>
            <ThemedText style={styles.sectionTitle}>Spendings by Category</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {categories.map((item) => (
                    <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={[styles.iconContainer, { backgroundColor: unifiedColor + '15' }]}>
                            <Image
                                source={item.imageSource}
                                style={styles.categoryImage}
                                resizeMode="contain"
                            />
                        </View>
                        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.amount}>Rs. {item.amount.toLocaleString()}</ThemedText>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginHorizontal: 24,
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    card: {
        width: 130,
        padding: 16,
        borderRadius: 20,
        // Suble shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    categoryImage: {
        width: 50,
        height: 50,
    },
    cardTitle: {
        fontSize: 14,
        opacity: 0.6,
        fontWeight: "500",
    },
    amount: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 4,
    },
});
