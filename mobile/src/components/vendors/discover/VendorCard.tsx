import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface VendorCardProps {
    name: string;
    category: string;
    rating: number;
    image: string;
    icon: string;
}

export function VendorCard({ name, category, rating, image, icon }: VendorCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Vendor Image */}
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

            {/* Vendor Info Section */}
            <View style={styles.infoSection}>
                <View style={styles.infoLeft}>
                    {/* Category Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                        <MaterialCommunityIcons
                            name={icon as any}
                            size={24}
                            color={colors.primary}
                        />
                    </View>

                    {/* Name, Category and Stars */}
                    <View style={styles.textContainer}>
                        <ThemedText style={styles.name}>{name}</ThemedText>
                        <ThemedText style={styles.category} lightColor={colors.secondary} darkColor={colors.secondary}>
                            {category}
                        </ThemedText>

                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                    key={star}
                                    name={star <= Math.floor(rating) ? "star" : "star-outline"}
                                    size={16}
                                    color={colors.starRating}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Contact Button */}
                <TouchableOpacity
                    style={[styles.contactButton, { backgroundColor: colors.vendorContactBg }]}
                    activeOpacity={0.8}
                >
                    <ThemedText style={[styles.contactText, { color: colors.vendorContact }]}>
                        Contact
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 20,
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    image: {
        width: "100%",
        height: 180,
    },
    infoSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    infoLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 22,
        includeFontPadding: false,
    },
    category: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
    },
    starsContainer: {
        flexDirection: "row",
        marginTop: 4,
        gap: 2,
    },
    contactButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    contactText: {
        fontSize: 15,
        fontWeight: "700",
    },
});
