import React, { useState, useMemo } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Table {
    id: string;
    name: string;
    description: string;
    currentGuests: number;
    maxGuests: number;
    isVip: boolean;
}

interface TableSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (table: Table) => void;
    selectedTableId?: string;
}

const MOCK_TABLES: Table[] = [
    { id: "1", name: "Head Table", description: "Table 1", currentGuests: 7, maxGuests: 10, isVip: true },
    { id: "2", name: "Family Table", description: "Table 2", currentGuests: 8, maxGuests: 10, isVip: false },
    { id: "3", name: "Friends Table", description: "Table 3", currentGuests: 5, maxGuests: 12, isVip: false },
    { id: "4", name: "VIP Friends", description: "Table 4", currentGuests: 9, maxGuests: 10, isVip: true },
    { id: "5", name: "Table 05", description: "Standard Table", currentGuests: 0, maxGuests: 10, isVip: false },
];

export function TableSelectorModal({ visible, onClose, onSelect, selectedTableId }: TableSelectorModalProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTables = useMemo(() => {
        return MOCK_TABLES.filter(table =>
            table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            table.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContent, { backgroundColor: colors.background, paddingBottom: insets.bottom + 20 }]}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={[styles.handle, { backgroundColor: colors.border }]} />
                                <View style={styles.headerRow}>
                                    <ThemedText style={styles.title}>Select Table</ThemedText>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color={colors.text} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Search Bar */}
                            <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
                                <Ionicons name="search" size={20} color={colors.placeholder} />
                                <TextInput
                                    style={[styles.searchInput, { color: colors.text }]}
                                    placeholder="Search tables..."
                                    placeholderTextColor={colors.placeholder}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                {searchQuery !== "" && (
                                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                                        <Ionicons name="close-circle" size={18} color={colors.placeholder} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Table List */}
                            <FlatList
                                data={filteredTables}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.tableItem,
                                            { backgroundColor: colors.card },
                                            selectedTableId === item.id && { borderColor: colors.primary, borderWidth: 2 }
                                        ]}
                                        onPress={() => onSelect(item)}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                                            <MaterialCommunityIcons name="table-furniture" size={24} color={colors.primary} />
                                        </View>
                                        <View style={styles.tableInfo}>
                                            <View style={styles.nameRow}>
                                                <ThemedText style={styles.tableName}>{item.name}</ThemedText>
                                                {item.isVip && <MaterialCommunityIcons name="crown" size={16} color="#FFB000" />}
                                            </View>
                                            <ThemedText style={[styles.tableDesc, { color: colors.secondary }]}>
                                                {item.description} • {item.currentGuests}/{item.maxGuests} Guests
                                            </ThemedText>
                                        </View>
                                        {selectedTableId === item.id && (
                                            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyContainer}>
                                        <ThemedText style={{ color: colors.secondary }}>No tables found matching your search.</ThemedText>
                                    </View>
                                )}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '80%',
        minHeight: '50%',
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 20,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        height: '100%',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    tableItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    tableInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tableName: {
        fontSize: 16,
        fontWeight: '700',
    },
    tableDesc: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
});
