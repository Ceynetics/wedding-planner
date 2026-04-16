import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, TextInput } from "react-native";

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
    groupType?: 'Family' | 'Individual';
    familyName?: string;
}

interface GuestCardProps {
    guest: Guest;
    onEdit?: () => void;
    onDelete?: () => void;
    onCall?: () => void;
    onMail?: () => void;
}

export function GuestCard({
    guest,
    onEdit,
    onDelete,
    onCall,
    onMail
}: GuestCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    
    // Toggle for expanded internal view
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Card Generation Form State
    const [cardGenMode, setCardGenMode] = useState<'Family' | 'Individual'>(guest.groupType || 'Individual');
    const [familyNameOnCard, setFamilyNameOnCard] = useState(guest.familyName || '');

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
        <TouchableOpacity 
            activeOpacity={0.85} 
            onPress={() => setIsExpanded(!isExpanded)}
            style={[styles.card, { backgroundColor: colors.card }]}
        >
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

            {/* Expanded Detailed View */}
            {isExpanded && (
                <View style={styles.expandedContent}>
                    {/* Private Contact Data */}
                    <View style={styles.contactDataBox}>
                        <View style={styles.contactDataRow}>
                            <Ionicons name="call" size={14} color={colors.secondary} />
                            <ThemedText style={styles.contactDataText}>{guest.phone || "No phone provided"}</ThemedText>
                        </View>
                        <View style={styles.contactDataRow}>
                            <Ionicons name="mail" size={14} color={colors.secondary} />
                            <ThemedText style={styles.contactDataText}>{guest.email || "No email provided"}</ThemedText>
                        </View>
                    </View>

                    {/* Invitation Card Generator */}
                    <View style={[styles.genCardBox, { backgroundColor: theme === 'light' ? colors.background : colors.background + '80' }]}>
                        <ThemedText style={[styles.genCardTitle, { color: colors.emphasis }]}>Print Settings</ThemedText>
                        
                        <View style={[styles.genOptionRow, { backgroundColor: colors.inputBackground }]}>
                            <TouchableOpacity
                                onPress={() => setCardGenMode('Family')}
                                style={[styles.genModeBtn, cardGenMode === 'Family' && { backgroundColor: colors.primary }]}
                            >
                                <ThemedText style={[styles.genModeText, { color: cardGenMode === 'Family' ? colors.primaryContrast : colors.placeholder }]}>Family Card</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setCardGenMode('Individual')}
                                style={[styles.genModeBtn, cardGenMode === 'Individual' && { backgroundColor: colors.primary }]}
                            >
                                <ThemedText style={[styles.genModeText, { color: cardGenMode === 'Individual' ? colors.primaryContrast : colors.placeholder }]}>Individual Card</ThemedText>
                            </TouchableOpacity>
                        </View>

                        {cardGenMode === 'Family' && (
                            <TextInput
                                placeholder="Family Name on Card (e.g. The Smiths)"
                                placeholderTextColor={colors.placeholder}
                                value={familyNameOnCard}
                                onChangeText={setFamilyNameOnCard}
                                style={[styles.genInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBackground }]}
                            />
                        )}

                        <TouchableOpacity style={[styles.genSubmitBtn, { borderColor: colors.primary }]}>
                            <MaterialCommunityIcons name="file-document-outline" size={18} color={colors.primary} />
                            <ThemedText style={{ color: colors.primary, fontWeight: '700', marginLeft: 6 }}>Generate</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Actions Row (Moved inside expanded view) */}
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
                                <Ionicons name="trash-outline" size={20} color={colors.statusError} />
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
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        marginHorizontal: 24,
        marginBottom: 16,
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
    // Expanded Content Styles
    expandedContent: {
        marginTop: 4,
    },
    contactDataBox: {
        paddingHorizontal: 4,
        marginBottom: 16,
        gap: 8,
    },
    contactDataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactDataText: {
        fontSize: 13,
        opacity: 0.8,
        fontWeight: '500',
    },
    genCardBox: {
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
    },
    genCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
    },
    genOptionRow: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 12,
    },
    genModeBtn: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    genModeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    genInput: {
        height: 44,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        marginBottom: 12,
    },
    genSubmitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: 'dashed',
    },
});
