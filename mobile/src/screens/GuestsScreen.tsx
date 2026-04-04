import { GuestCard, Guest } from "@/components/guests/GuestCard";
import { GuestHeader } from "@/components/guests/GuestHeader";
import { GuestStats } from "@/components/guests/GuestStats";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useGuests } from "@/hooks/useGuests";
import { displayEnum } from "@/utils/enums";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function GuestsScreen() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const { guests, stats, isLoading, fetchGuests, deleteGuest } = useGuests();
    const [searchQuery, setSearchQuery] = useState("");
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            fetchGuests({ search: searchQuery || undefined });
        }, 400);
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, [searchQuery, fetchGuests]);

    const mappedGuests = guests.map(g => ({
        id: String(g.id),
        name: g.name,
        avatar: g.avatarUrl || `https://i.pravatar.cc/150?u=${g.id}`,
        isVIP: g.isVip,
        status: displayEnum(g.status) as any,
        side: displayEnum(g.side) as any,
        category: displayEnum(g.category) || 'Other',
        adults: g.adults || 1,
        children: g.children || 0,
        dietary: g.dietary || 'Non-Veg',
        phone: g.phone || '',
        email: g.email || '',
    }));

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            {/* Fixed Header and Stats Section */}
            <View style={styles.fixedSection}>
                <GuestHeader />

                {/* Stats Summary Cards with Search */}
                <View style={styles.statsContainer}>
                    <GuestStats
                        total={stats?.total ?? 0}
                        confirmed={stats?.confirmed ?? 0}
                        pending={stats?.pending ?? 0}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onFilterPress={() => console.log("Filter pressed")}
                    />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Guests List */}
                <View style={styles.listContainer}>
                    {isLoading && guests.length === 0 ? (
                        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
                    ) : (
                        mappedGuests.map((guest) => (
                            <GuestCard
                                key={guest.id}
                                guest={guest}
                                onEdit={() => router.push({ pathname: "/(forms)/guests/edit", params: { id: guest.id } } as any)}
                                onDelete={async () => { await deleteGuest(Number(guest.id)); }}
                                onCall={() => console.log("Call:", guest.phone)}
                                onMail={() => console.log("Mail:", guest.email)}
                            />
                        ))
                    )}
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
    fixedSection: {
        zIndex: 10,
    },
    scrollContent: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    statsContainer: {
        zIndex: 2,
    },
    listContainer: {
        marginTop: 10,
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
