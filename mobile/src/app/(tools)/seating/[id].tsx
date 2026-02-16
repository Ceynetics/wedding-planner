import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
    TextInput,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function SeatingDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    // Mock data for the table - in a real app, this would be fetched based on the ID
    const [tableData, setTableData] = useState({
        name: "Head Table",
        description: "Table 1",
        currentGuests: 7,
        maxGuests: 10,
        isVip: true,
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editedData, setEditedData] = useState({ ...tableData });

    const handleSave = () => {
        setTableData({ ...editedData });
        setIsEditModalVisible(false);
    };

    const handleDelete = () => {
        // Implementation for delete
        console.log("Delete table", id);
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: colors.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>{tableData.name}</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Info Card */}
                <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
                    <View style={styles.topSection}>
                        <View style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}>
                            <MaterialCommunityIcons name="table-furniture" size={40} color={colors.primary} />
                        </View>
                        <View style={styles.mainInfo}>
                            <View style={styles.titleRow}>
                                <ThemedText style={styles.tableName}>{tableData.name}</ThemedText>
                                {tableData.isVip && (
                                    <MaterialCommunityIcons name="crown" size={24} color="#FFB000" />
                                )}
                            </View>
                            <ThemedText style={[styles.tableDesc, { color: colors.secondary }]}>
                                {tableData.description}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.secondary + "20" }]} />

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <ThemedText style={[styles.statLabel, { color: colors.secondary }]}>Guests</ThemedText>
                            <ThemedText style={styles.statValue}>{tableData.currentGuests} / {tableData.maxGuests}</ThemedText>
                        </View>
                        <View style={styles.statItem}>
                            <ThemedText style={[styles.statLabel, { color: colors.secondary }]}>Type</ThemedText>
                            <ThemedText style={styles.statValue}>{tableData.isVip ? "VIP Table" : "Standard"}</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => setIsEditModalVisible(true)}
                    >
                        <Ionicons name="create-outline" size={22} color="#FFFFFF" />
                        <ThemedText style={styles.actionButtonText}>Edit Table Details</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.deleteButton, { borderColor: colors.error + "40" }]}
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash-outline" size={22} color={colors.error} />
                        <ThemedText style={[styles.deleteButtonText, { color: colors.error }]}>Delete Table</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Modal (Pop-up) */}
            <Modal
                visible={isEditModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>Edit Table</ThemedText>
                            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.label}>Table Name</ThemedText>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={editedData.name}
                                    onChangeText={(text) => setEditedData({ ...editedData, name: text })}
                                    placeholder="e.g. Head Table"
                                    placeholderTextColor={colors.secondary}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.label}>Table Description</ThemedText>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={editedData.description}
                                    onChangeText={(text) => setEditedData({ ...editedData, description: text })}
                                    placeholder="e.g. Family Table"
                                    placeholderTextColor={colors.secondary}
                                />
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.secondary + "40" }]}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <ThemedText>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                                onPress={handleSave}
                            >
                                <ThemedText style={{ color: "#FFFFFF", fontWeight: "700" }}>Save Changes</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    scrollContent: {
        padding: 24,
    },
    detailCard: {
        padding: 24,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 32,
    },
    topSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    iconBox: {
        width: 72,
        height: 72,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    mainInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    tableName: {
        fontSize: 22,
        fontWeight: "800",
    },
    tableDesc: {
        fontSize: 15,
        fontWeight: "500",
        marginTop: 4,
    },
    divider: {
        height: 1,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    actionsContainer: {
        gap: 16,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        borderRadius: 20,
        gap: 12,
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        borderRadius: 20,
        borderWidth: 1.5,
        gap: 12,
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        justifyContent: "center",
    },
    input: {
        fontSize: 15,
        fontWeight: "500",
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    cancelBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
    },
    saveBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
});
