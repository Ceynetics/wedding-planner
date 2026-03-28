// =============================================================================
// IMPORTS
// =============================================================================
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// =============================================================================
// CONSTANTS & HELPERS
// =============================================================================
const { width } = Dimensions.get("window");

/**
 * Mock data for the Vendor Details page.
 * Ideally, this would be fetched from an API using the {id} search parameter.
 */
const MOCK_VENDOR_DATA = {
    id: "1",
    name: "Lumina Studios",
    category: "Photography & Cinematography",
    rating: 4.8,
    reviews: 124,
    price: "Rs. 250,000 - 500,000",
    description: "Lumina Studios is a premier wedding photography and cinematography studio based in Colombo. With over 10 years of experience, we specialize in capturing the raw emotions and beautiful moments of your special day.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    address: "123 Galle Road, Colombo 03",
    email: "contact@luminastudios.com",
    phone: "+94 77 123 4567",
    services: [
        "Pre-wedding Shoot",
        "Wedding Photography",
        "Cinematic Wedding Film",
        "Album Design & Printing",
    ],
};

// =============================================================================
// MAIN COMPONENT: VendorDetailsScreen
// =============================================================================
export default function VendorDetailsScreen() {
    // --- Hooks & Context ---
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    // --- Data Source ---
    // In a real application, data would be dynamically fetched here based on {id}
    const vendor = MOCK_VENDOR_DATA;

    return (
        <ThemedView style={styles.container}>
            {/* Native Navigation Configuration */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* -------------------------------------------------------------
                SECTION 1: FIXED HERO IMAGE
                (Anchored at top while content scrolls over)
               ------------------------------------------------------------- */}
            <View style={[styles.fixedHero, { height: width * 0.85 }]}>
                <Image source={{ uri: vendor.image }} style={styles.heroImage} />
            </View>

            {/* Overlay Action Buttons (Fixed at Top, outside ScrollView for tap priority) */}
            <View style={[styles.headerActions, { top: insets.top + 10 }]}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={[styles.actionBtn, { backgroundColor: colors.card }]}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card }]}>
                    <Ionicons name="heart-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {/* Transparent Spacer to expose the fixed hero below */}
                <View style={{ height: width * 0.78 }} />


                {/* -------------------------------------------------------------
                    SECTION 2: CONTENT WRAPPER (Slides Over Hero)
                   ------------------------------------------------------------- */}
                <View style={[styles.contentWrapper, { backgroundColor: colors.background }]}>
                    
                    {/* Header: Title, Category & Top Rated Tag */}
                    <View style={styles.titleContainer}>
                        <View style={styles.nameRow}>
                            <ThemedText style={styles.vendorName}>{vendor.name}</ThemedText>
                            <View style={[styles.tagContainer, { backgroundColor: colors.primary + "15" }]}>
                                <ThemedText style={[styles.tagText, { color: colors.primary }]}>Top Rated</ThemedText>
                            </View>
                        </View>
                        <ThemedText style={styles.categoryText} lightColor={colors.secondary} darkColor={colors.secondary}>
                            {vendor.category}
                        </ThemedText>
                    </View>

                    {/* Quick Stats: Rating & Pricing */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="star" size={20} color={colors.starRating} />
                            <ThemedText style={styles.statValue}>{vendor.rating}</ThemedText>
                            <ThemedText style={styles.statLabel}>({vendor.reviews} reviews)</ThemedText>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.primary} />
                            <ThemedText style={[styles.statValue, { flex: 1 }]}>{vendor.price}</ThemedText>
                        </View>
                    </View>

                    {/* About Section: Business Description */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>About</ThemedText>
                        <ThemedText style={styles.description}>{vendor.description}</ThemedText>
                    </View>

                    {/* Services Section: Offering Tags (Horizontal Scroll) */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Our Services</ThemedText>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            contentContainerStyle={styles.servicesScroll}
                        >
                            {vendor.services.map((service, index) => (
                                <View key={index} style={[styles.serviceTag, { backgroundColor: colors.card }]}>
                                    <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                                    <ThemedText style={styles.serviceText} numberOfLines={1}>
                                        {service}
                                    </ThemedText>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Contact Section: Location & Details Card */}
                    <View style={[styles.contactCard, { backgroundColor: colors.card }]}>
                        <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
                        
                        <View style={styles.contactItem}>
                            <Ionicons name="location-outline" size={22} color={colors.primary} />
                            <ThemedText style={styles.contactValue}>{vendor.address}</ThemedText>
                        </View>
                        <View style={styles.contactItem}>
                            <Ionicons name="mail-outline" size={22} color={colors.primary} />
                            <ThemedText style={styles.contactValue}>{vendor.email}</ThemedText>
                        </View>
                        <View style={styles.contactItem}>
                            <Ionicons name="call-outline" size={22} color={colors.primary} />
                            <ThemedText style={styles.contactValue}>{vendor.phone}</ThemedText>
                        </View>
                    </View>
                    {/* In-Line Action Buttons (Stacked & Scrollable) */}
                    <View style={styles.contentFooter}>
                        <TouchableOpacity 
                            style={[styles.secondaryAction, { borderColor: colors.primary }]}
                            onPress={() => console.log("Message vendor")}
                        >
                            <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
                            <ThemedText style={[styles.secondaryText, { color: colors.primary }]}>Message Vendor</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.primaryAction, { backgroundColor: colors.primary }]}
                            onPress={() => console.log("Hire vendor")}
                        >
                            <ThemedText style={styles.primaryText}>Hire Vendor</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

// =============================================================================
// STYLESHEET
// =============================================================================
const styles = StyleSheet.create({
    // --- Layout Containers ---
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },

    // --- Section 1: Hero & Header ---
    fixedHero: {
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    headerActions: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        zIndex: 100, // Extremely high priority to avoid overlap from scroll container handles
    },
    actionBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    // --- Section 2: Main Content Wrapper ---
    contentWrapper: {
        marginTop: -30,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 24,
        paddingTop: 32,
    },

    // --- Profile Header (Title & Tags) ---
    titleContainer: {
        marginBottom: 20,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
        gap: 12,
    },
    vendorName: {
        fontSize: 26,
        fontWeight: "800",
        flex: 1,
    },
    tagContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    categoryText: {
        fontSize: 16,
        fontWeight: "600",
    },

    // --- Analytics / Stats Row ---
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        marginBottom: 24,
        gap: 16,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    statLabel: {
        fontSize: 14,
        opacity: 0.6,
    },
    divider: {
        width: 1,
        height: 24,
        opacity: 0.5,
    },

    // --- General Section Styling ---
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        opacity: 0.8,
    },

    // --- Services Horizontal Scroll & Tags ---
    servicesScroll: {
        gap: 12,
        paddingRight: 24, // Ensures the last item doesn't cut off
        paddingVertical: 8, // Crucial: Prevents shadow clipping at top/bottom
    },
    serviceTag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        gap: 8,
        // Elevation for Android / Shadows for iOS
        backgroundColor: "white", 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        // Ensure no wrapping within this tag
        minWidth: 100,
    },
    serviceText: {
        fontSize: 14,
        fontWeight: "600",
    },

    // --- Contact Card Block ---
    contactCard: {
        padding: 24,
        borderRadius: 24,
        marginBottom: 32,
        gap: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    contactValue: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        opacity: 0.9,
    },

    // --- In-Line Action Buttons (Stacked) ---
    contentFooter: {
        marginTop: 8,
        marginBottom: 32,
        gap: 12,
    },
    primaryAction: {
        width: "100%",
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    primaryText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    secondaryAction: {
        width: "100%",
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    secondaryText: {
        fontSize: 15,
        fontWeight: "700",
    },
});
