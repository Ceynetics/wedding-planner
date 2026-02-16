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

interface TableCardProps {
    id: string;
    name: string;
    description: string;
    currentGuests: number;
    maxGuests: number;
    isVip?: boolean;
    onRemove?: () => void;
    onPress?: () => void;
}

export function TableCard({ id, name, description, currentGuests, maxGuests, isVip, onRemove, onPress }: TableCardProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

    const progress = Math.min(currentGuests / maxGuests, 1);

    const handleRemove = () => {
        setShowMenu(false);
        onRemove?.();
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.leftInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                        <MaterialCommunityIcons name="table-furniture" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                            <ThemedText style={styles.name}>{name}</ThemedText>
                            {isVip && (
                                <MaterialCommunityIcons name="crown" size={18} color="#FFB000" style={styles.vipIcon} />
                            )}
                        </View>
                        <ThemedText style={styles.description} lightColor={colors.secondary} darkColor={colors.secondary}>
                            {description}
                        </ThemedText>
                    </View>
                </View>
                {/* option button */}
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

                    {/* Options Menu */}
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
                                                Remove Table
                                            </ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    )}
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarTrack, { backgroundColor: theme === 'light' ? '#E2E8F0' : '#334155' }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progress * 100}%`,
                                    backgroundColor: colors.primary
                                }
                            ]}
                        />
                    </View>
                    <ThemedText style={styles.statusText} lightColor={colors.secondary} darkColor={colors.secondary}>
                        {currentGuests}/{maxGuests} Guests
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
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
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    leftInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
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
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
    },
    vipIcon: {
        marginTop: -2,
    },
    description: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
    },
    menuButton: {
        padding: 4,
    },
    progressSection: {
        marginTop: 16,
    },
    progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    progressBarTrack: {
        flex: 1,
        height: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 5,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "600",
        minWidth: 75,
        textAlign: "right",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "transparent",
    },
    menuContainer: {
        position: "absolute",
        width: 150,
        borderRadius: 12,
        padding: 4,
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
