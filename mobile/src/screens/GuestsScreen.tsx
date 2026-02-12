import { GuestCard, Guest } from "@/components/guests/GuestCard";
import { GuestFilters } from "@/components/guests/GuestFilters";
import { GuestHeader } from "@/components/guests/GuestHeader";
import { GuestStats } from "@/components/guests/GuestStats";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function GuestsScreen() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [searchQuery, setSearchQuery] = useState("");

    const dummyGuests: Guest[] = [
        {
            id: "1",
            name: "Wade Warren",
            avatar: "https://i.pravatar.cc/150?u=wade",
            isVIP: true,
            status: "Pending",
            side: "Bride",
            category: "Family",
            adults: 2,
            children: 1,
            dietary: "Vegetarian",
            phone: "+1 234 567 890",
            email: "wade@example.com",
        },
        {
            id: "2",
            name: "Jerome Bell",
            avatar: "https://i.pravatar.cc/150?u=jerome",
            isVIP: false,
            status: "Confirmed",
            side: "Bride",
            category: "Family",
            adults: 2,
            children: 1,
            dietary: "Vegetarian",
            phone: "+1 234 567 891",
            email: "jerome@example.com",
        },
        {
            id: "3",
            name: "Albert Flores",
            avatar: "https://i.pravatar.cc/150?u=albert",
            isVIP: true,
            status: "Not Invited",
            side: "Groom",
            category: "Colleague",
            adults: 1,
            children: 0,
            dietary: "Non-Veg",
            phone: "+1 234 567 892",
            email: "albert@example.com",
            hasInvitationSent: true,
        },
        {
            id: "4",
            name: "Bessie Cooper",
            avatar: "https://i.pravatar.cc/150?u=bessie",
            isVIP: false,
            status: "Confirmed",
            side: "Groom",
            category: "Family",
            adults: 2,
            children: 1,
            dietary: "Vegetarian",
            phone: "+1 234 567 893",
            email: "bessie@example.com",
        },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <GuestHeader />

                {/* Stats Summary Cards */}
                <View style={styles.statsContainer}>
                    <GuestStats total={124} confirmed={86} pending={24} />
                </View>

                {/* Search and Filters Section */}
                <GuestFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onFilterPress={() => console.log("Filter pressed")}
                />

                {/* Guests List */}
                <View style={styles.listContainer}>
                    {dummyGuests.map((guest) => (
                        <GuestCard
                            key={guest.id}
                            guest={guest}
                            onEdit={() => console.log("Edit:", guest.name)}
                            onDelete={() => console.log("Delete:", guest.name)}
                            onCall={() => console.log("Call:", guest.phone)}
                            onMail={() => console.log("Mail:", guest.email)}
                            onShareInvitation={guest.id === "3" ? () => console.log("Share Invitation") : undefined}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.emphasis }]}
                activeOpacity={0.8}
                onPress={() => router.push("/(forms)/guests/add" as any)}
            >
                <Ionicons name="person-add" size={28} color={colors.primaryContrast} />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    statsContainer: {
        zIndex: 2,
    },
    listContainer: {
        marginTop: 20,
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
});
