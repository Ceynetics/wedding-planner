import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export function GuestSummary() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    // Mock data
    const total = 1000;
    const confirmed = 500;
    const pending = 224;
    const declined = 225;

    // Calculations
    const confirmedWidth = (confirmed / total) * 100;
    const pendingWidth = (pending / total) * 100;
    const declinedWidth = (declined / total) * 100;

    return (
        <View style={styles.container}>
            <View style={[styles.mainCard, { backgroundColor: colors.card }]}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={[styles.headerIconBg, { backgroundColor: colors.primary + "15" }]}>
                        <Ionicons name="people" size={18} color={colors.primary} />
                    </View>
                    <ThemedText style={[styles.title, { color: colors.primary }]}>
                        Guest List
                    </ThemedText>
                </View>

                {/* Total Stats Section */}
                <View style={styles.totalSection}>
                    <View>
                        <ThemedText style={styles.totalValue}>{total}</ThemedText>
                        <ThemedText style={styles.totalLabel}>Total Added Guests</ThemedText>
                    </View>
                    <View style={styles.totalIconBg}>
                        <Ionicons name="person-add" size={24} color={colors.secondary} opacity={0.3} />
                    </View>
                </View>

                {/* Multi-Segment Progress Bar */}
                <View style={[styles.fullProgressTrack, { backgroundColor: colors.inputBackground }]}>
                    <View style={[styles.segment, { backgroundColor: colors.success, width: `${confirmedWidth}%` }]} />
                    <View style={[styles.segment, { backgroundColor: colors.warning, width: `${pendingWidth}%` }]} />
                    <View style={[styles.segment, { backgroundColor: colors.error, width: `${declinedWidth}%` }]} />
                </View>

                {/* Status Breakdown Grid */}
                <View style={styles.statusGrid}>
                    <View style={styles.statusItem}>
                        <View style={[styles.dot, { backgroundColor: colors.success }]} />
                        <ThemedText style={styles.statusCount}>{confirmed}</ThemedText>
                        <ThemedText style={styles.statusLabel}>Confirmed</ThemedText>
                    </View>
                    <View style={[styles.statusItem, styles.statusBorder]}>
                        <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                        <ThemedText style={styles.statusCount}>{pending}</ThemedText>
                        <ThemedText style={styles.statusLabel}>Pending</ThemedText>
                    </View>
                    <View style={styles.statusItem}>
                        <View style={[styles.dot, { backgroundColor: colors.error }]} />
                        <ThemedText style={styles.statusCount}>{declined}</ThemedText>
                        <ThemedText style={styles.statusLabel}>Declined</ThemedText>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    mainCard: {
        padding: 24,
        borderRadius: 24,
        // Premium floating shadow
        // elevation: 4,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.05,
        // shadowRadius: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        gap: 10,
    },
    headerIconBg: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalValue: {
        fontSize: 35,
        fontWeight: "900",
        letterSpacing: -1,
        includeFontPadding: false,
        lineHeight: 42,
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: "600",
        opacity: 0.5,
    },
    totalIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullProgressTrack: {
        height: 8,
        borderRadius: 4,
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 24,
    },
    segment: {
        height: '100%',
    },
    statusGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusItem: {
        flex: 1,
        alignItems: 'center',
    },
    statusBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    statusCount: {
        fontSize: 16,
        fontWeight: "800",
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: "700",
        opacity: 0.4,
        marginTop: 2,
    },
});
