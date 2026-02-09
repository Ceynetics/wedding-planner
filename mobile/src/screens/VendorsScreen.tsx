import { VendorCard as DiscoverCard } from "@/components/vendors/discover/VendorCard";
import { VendorFilters as DiscoverFilters } from "@/components/vendors/discover/VendorFilters";
import { HiredFilters } from "@/components/vendors/hired/HiredFilters";
import { HiredStats } from "@/components/vendors/hired/HiredStats";
import { HiredVendorCard } from "@/components/vendors/hired/HiredVendorCard";
import { VendorHeader } from "@/components/vendors/shared/VendorHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_DISCOVER_VENDORS = [
    {
        id: "1",
        name: "Lumina Studios",
        category: "Photography",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop",
        icon: "camera",
    },
    {
        id: "2",
        name: "Lumina Studios",
        category: "Cinematography",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop",
        icon: "video",
    },
];

const MOCK_HIRED_VENDORS = [
    {
        id: "1",
        name: "Blossom Florals",
        category: "Floral Arrangements & Decor",
        paidAmount: 5000,
        totalAmount: 25000,
        dueDate: "Oct 15",
    },
    {
        id: "2",
        name: "Blossom Florals",
        category: "Floral Arrangements & Decor",
        paidAmount: 5000,
        totalAmount: 25000,
        dueDate: "Oct 15",
    },
];

export default function VendorsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState<"discover" | "hired">("discover");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const gradientColors = (theme === "light"
        ? [colors.primary + "40", colors.primary + "10"]
        : [colors.primary + "60", colors.background]) as [string, string, ...string[]];

    const isDiscover = activeTab === "discover";

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            <VendorHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
            >
                {isDiscover ? (
                    <>
                        <DiscoverFilters
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onFilterPress={() => console.log("Filter pressed")}
                        />
                        <View style={styles.vendorList}>
                            {MOCK_DISCOVER_VENDORS.map((vendor) => (
                                <DiscoverCard key={vendor.id} {...vendor} />
                            ))}
                        </View>
                        {/* Pagination */}
                        <View style={[styles.paginationContainer, { backgroundColor: colors.paginationBg }]}>
                            <TouchableOpacity
                                style={[styles.pageButton, styles.activePageButton, { backgroundColor: colors.emphasis }]}
                                onPress={() => setCurrentPage(1)}
                            >
                                <ThemedText style={styles.activePageText}>1</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pageButton} onPress={() => setCurrentPage(2)}>
                                <ThemedText style={[styles.pageText, { color: colors.secondary }]}>2</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pageButton} onPress={() => setCurrentPage(3)}>
                                <ThemedText style={[styles.pageText, { color: colors.secondary }]}>3</ThemedText>
                            </TouchableOpacity>
                            <ThemedText style={[styles.pageText, { color: colors.secondary }]}>...</ThemedText>
                            <TouchableOpacity style={styles.pageButton}>
                                <Ionicons name="arrow-forward" size={20} color={colors.secondary} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <HiredStats budget={300000} paid={300000} pending={300000} />
                        <HiredFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                        <View style={styles.vendorList}>
                            {MOCK_HIRED_VENDORS.map((vendor) => (
                                <HiredVendorCard key={vendor.id} {...vendor} />
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>

            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.emphasis }]}>
                <MaterialCommunityIcons name="plus-box" size={32} color="#FFFFFF" />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    scrollContent: {
        // Space handled by paddingBottom
    },
    vendorList: {
        paddingHorizontal: 24,
        marginTop: 8,
    },
    paginationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.03)",
        paddingHorizontal: 20,
        height: 64,
        borderRadius: 32,
        gap: 8,
    },
    pageButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    activePageButton: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    pageText: {
        fontSize: 16,
        fontWeight: "600",
    },
    activePageText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    fab: {
        position: "absolute",
        bottom: 40,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
});
