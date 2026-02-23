import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";

interface HiredVendorCardProps {
    name: string;
    category: string;
    paidAmount: number;
    totalAmount: number;
    dueDate: string;
    onRemove?: () => void;
}

export function HiredVendorCard({ name, category, paidAmount, totalAmount, dueDate, onRemove }: HiredVendorCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

    const progress = Math.min(paidAmount / totalAmount, 1);

    const handleRemove = () => {
        setShowMenu(false);
        onRemove?.();
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                    <MaterialCommunityIcons name="flower-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.textContainer}>
                    <ThemedText style={styles.name}>{name}</ThemedText>
                    <ThemedText style={styles.category} lightColor={colors.secondary} darkColor={colors.secondary}>
                        {category}
                    </ThemedText>
                </View>
                {/* option menu */}
                <View>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={(e) => {
                            const ref = e.currentTarget;
                            // @ts-ignore
                            ref.measureInWindow((x, y, width, height) => {
                                setMenuPosition({ top: y + height, right: 24 });
                                setShowMenu(true);
                            });
                        }}
                    >
                        <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.secondary} />
                    </TouchableOpacity>

                    {/* Options Menu Pop-up */}
                    {showMenu && (
                        <Modal
                            transparent={true}
                            visible={showMenu}
                            animationType="fade"
                            onRequestClose={() => setShowMenu(false)}
                        >
                            <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
                                <View style={styles.modalOverlay}>
                                    <View
                                        style={[
                                            styles.menuContainer,
                                            {
                                                backgroundColor: colors.card,
                                                shadowColor: "#000",
                                                top: menuPosition.top,
                                                right: menuPosition.right,
                                            }
                                        ]}
                                    >
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={handleRemove}
                                        >
                                            <ThemedText style={[styles.menuText, { color: colors.error }]}>
                                                Remove Vendor
                                            </ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    )}
                </View>
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
                <View style={styles.progressLabelRow}>
                    <ThemedText style={styles.progressLabel}>Rs. {paidAmount.toLocaleString()} Paid</ThemedText>
                    <ThemedText style={styles.progressLabel}>Total: Rs. {totalAmount.toLocaleString()}</ThemedText>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progress * 100}%`, backgroundColor: colors.primary }
                        ]}
                    />
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.dateContainer}>
                    <MaterialCommunityIcons name="calendar-clock" size={24} color={colors.text} />
                    <ThemedText style={styles.dueDate}>Due : {dueDate}</ThemedText>
                </View>
                <TouchableOpacity
                    style={[styles.detailsButton, { backgroundColor: colors.inputBackground }]}
                    activeOpacity={0.7}
                >
                    <ThemedText style={styles.detailsText}>View Details</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        // Premium shadow for card
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 10 },
        // shadowOpacity: 0.05,
        // shadowRadius: 20,
        // elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
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
    },
    category: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
    },
    menuButton: {
        padding: 4,
    },
    progressSection: {
        marginBottom: 24,
    },
    progressLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    progressLabel: {
        fontSize: 13,
        fontWeight: "600",
        opacity: 0.7,
    },
    progressTrack: {
        height: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 5,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    dueDate: {
        fontSize: 16,
        fontWeight: "700",
    },
    detailsButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
    },
    detailsText: {
        fontSize: 15,
        fontWeight: "700",
        includeFontPadding: false,
    },
    // Modal & Menu Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "transparent",
    },
    menuContainer: {
        position: "absolute",
        width: 150,
        borderRadius: 12,
        padding: 4,
        // Premium shadow for menu
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    menuItem: {
        padding: 12,
        borderRadius: 8,
    },
    menuText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
