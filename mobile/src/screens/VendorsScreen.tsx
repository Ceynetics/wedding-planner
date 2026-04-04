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
import { useVendors } from "@/hooks/useVendors";
import { displayEnum } from "@/utils/enums";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VendorsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { discoverVendors, hiredVendors, isLoading, deleteHiredVendor } = useVendors();

    const [activeTab, setActiveTab] = useState<"discover" | "hired">("discover");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const isDiscover = activeTab === "discover";

    const mappedDiscoverVendors = discoverVendors.map((v) => ({
        id: String(v.id),
        name: v.name,
        category: displayEnum(v.category),
        rating: v.rating ?? 0,
        image: v.imageUrl ?? "",
        icon: "camera",
    }));

    const mappedHiredVendors = hiredVendors.map((v) => ({
        id: String(v.id),
        name: v.vendorName,
        category: displayEnum(v.category),
        paidAmount: v.paidAmount ?? 0,
        totalAmount: v.totalAmount ?? 0,
        dueDate: v.dueDate ?? "",
    }));

    const handleRemoveVendor = async (vendorId: string) => {
        await deleteHiredVendor(Number(vendorId));
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
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
                            {mappedDiscoverVendors.map((vendor) => (
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
                            {mappedHiredVendors.length > 0 ? (
                                mappedHiredVendors.map((vendor) => (
                                    <HiredVendorCard
                                        key={vendor.id}
                                        {...vendor}
                                        onRemove={() => handleRemoveVendor(vendor.id)}
                                    />
                                ))
                            ) : (
                                <View style={{ alignItems: 'center', marginTop: 40 }}>
                                    <ThemedText style={{ opacity: 0.6 }}>No hired vendors found.</ThemedText>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.emphasis }]}
                onPress={() => router.push("/(forms)/vendors/add" as any)}
            >
                <MaterialCommunityIcons name="plus" size={32} color={colors.primaryContrast} />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
