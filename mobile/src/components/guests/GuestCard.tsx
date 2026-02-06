import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export type GuestStatus = "Pending" | "Confirmed" | "Not Invited";
export type GuestSide = "Bride" | "Groom";

export interface Guest {
    id: string;
    name: string;
    avatar: string;
    isVIP: boolean;
    status: GuestStatus;
    side: GuestSide;
    category: string;
    adults: number;
    children: number;
    dietary: string;
    phone: string;
    email: string;
    hasInvitationSent?: boolean;
}

interface GuestCardProps {
    guest: Guest;
    onEdit?: () => void;
    onDelete?: () => void;
    onCall?: () => void;
    onMail?: () => void;
    onShareInvitation?: () => void;
}

export function GuestCard({
    guest,
    onEdit,
    onDelete,
    onCall,
    onMail,
    onShareInvitation
}: GuestCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const getStatusColors = (status: GuestStatus) => {
        switch (status) {
            case "Confirmed":
                return { text: colors.statusConfirmed, bg: colors.statusConfirmedBg };
            case "Not Invited":
                return { text: colors.statusError, bg: colors.statusErrorBg };
            case "Pending":
            default:
                return { text: colors.statusPending, bg: colors.statusPendingBg };
        }
    };

    const getSideColors = (side: GuestSide) => {
        switch (side) {
            case "Bride":
                return { text: colors.brideTag, bg: colors.brideTagBg };
            case "Groom":
                return { text: colors.groomTag, bg: colors.groomTagBg };
        }
    };

    const statusColors = getStatusColors(guest.status);
    const sideColors = getSideColors(guest.side);

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Top Row: Avatar, Name, VIP, Status */}
            <View style={styles.header}>
                <Image source={{ uri: guest.avatar }} style={styles.avatar} />
                <View style={styles.nameContainer}>
                    <View style={styles.nameRow}>
                        <ThemedText style={styles.name} numberOfLines={1}>
                            {guest.name}
                        </ThemedText>
                        {guest.isVIP && (
                            <MaterialCommunityIcons name="crown" size={18} color="#F59E0B" style={styles.vipIcon} />
                        )}
                    </View>
                    <View style={styles.badgeRow}>
                        <View style={[styles.sideBadge, { backgroundColor: sideColors.bg }]}>
                            <ThemedText style={[styles.sideText, { color: sideColors.text }]}>
                                {guest.side}
                            </ThemedText>
                        </View>
                        <ThemedText style={styles.categoryText}>
                            • {guest.category}
                        </ThemedText>
                    </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColors.text }]} />
                    <ThemedText style={[styles.statusText, { color: statusColors.text }]}>
                        {guest.status}
                    </ThemedText>
                </View>
            </View>

            {/* Details Row: Guests count, Dietary */}
            <View style={[styles.detailsRow, { backgroundColor: theme === 'light' ? colors.background : colors.background + '80' }]}>
                <View style={styles.detailItem}>
                    <Ionicons name="people" size={16} color={colors.primary} />
                    <ThemedText style={styles.detailText}>
                        {guest.adults} Adults, {guest.children} Child
                    </ThemedText>
                </View>
                <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="silverware-fork-knife" size={16} color={colors.primary} />
                    <ThemedText style={styles.detailText}>
                        {guest.dietary}
                    </ThemedText>
                </View>
            </View>

            {/* Invitation Action (Optional) - if Guest not invited */}
            {onShareInvitation && (
                <TouchableOpacity
                    onPress={onShareInvitation}
                    style={[styles.shareInvitationButton, { backgroundColor: colors.primary }]}
                >
                    <ThemedText style={styles.shareInvitationText}>
                        Share Invitation
                    </ThemedText>
                </TouchableOpacity>
            )}

            {/* Bottom Actions Row */}
            <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
                <View style={styles.contactActions}>
                    <TouchableOpacity onPress={onCall} style={styles.iconAction}>
                        <Ionicons name="call-outline" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onMail} style={styles.iconAction}>
                        <Ionicons name="mail-outline" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.editActions}>
                    <TouchableOpacity onPress={onDelete} style={styles.iconAction}>
                        <Ionicons name="trash-outline" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onEdit}
                        style={[styles.editButton, { backgroundColor: colors.primary + '15' }]}
                    >
                        <ThemedText style={[styles.editText, { color: colors.primary }]}>
                            Edit
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        marginHorizontal: 24,
        marginBottom: 16,
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    nameContainer: {
        flex: 1,
        marginLeft: 12,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        maxWidth: "80%",
    },
    vipIcon: {
        marginLeft: 4,
    },
    badgeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    sideBadge: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    sideText: {
        fontSize: 12,
        fontWeight: "700",
    },
    categoryText: {
        fontSize: 13,
        opacity: 0.6,
        marginLeft: 4,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        fontWeight: "500",
        opacity: 0.7,
    },
    shareInvitationButton: {
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    shareInvitationText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        paddingTop: 12,
    },
    contactActions: {
        flexDirection: "row",
        gap: 16,
    },
    editActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    iconAction: {
        padding: 4,
    },
    editButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10,
    },
    editText: {
        fontSize: 14,
        fontWeight: "700",
    },
});
