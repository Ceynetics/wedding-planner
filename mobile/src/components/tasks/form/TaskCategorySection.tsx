import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

export type TaskCategory = string;

interface TaskCategorySectionProps {
    category: TaskCategory;
    onCategoryChange: (category: TaskCategory) => void;
}

export function TaskCategorySection({ category, onCategoryChange }: TaskCategorySectionProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    
    const [categories, setCategories] = useState<string[]>(["Venue", "Food", "Attire", "Flowers"]);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const handleAddCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed) {
            if (!categories.includes(trimmed)) {
                setCategories([...categories, trimmed]);
            }
            onCategoryChange(trimmed);
            setNewCategory("");
            setShowModal(false);
        }
    };

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                        <Ionicons name="grid-outline" size={20} color={colors.text} />
                    </View>
                    <ThemedText style={styles.cardItemText}>Category</ThemedText>
                </View>
                <View style={styles.categoryContainer}>
                    {categories.map((c) => (
                        <TouchableOpacity
                            key={c}
                            onPress={() => onCategoryChange(c)}
                            style={[
                                styles.categoryButton,
                                { backgroundColor: colors.inputBackground },
                                category === c && { backgroundColor: colors.primary },
                            ]}
                        >
                            <Ionicons 
                                name="pricetag-outline" 
                                size={22} 
                                color={category === c ? colors.primaryContrast : colors.secondary} 
                                style={styles.defaultIcon}
                            />
                            <ThemedText
                                style={[
                                    styles.categoryButtonText,
                                    { color: colors.placeholder },
                                    category === c && { color: colors.primaryContrast },
                                ]}
                            >
                                {c}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                    
                    {/* Add Custom Category Button */}
                    <TouchableOpacity
                        onPress={() => setShowModal(true)}
                        style={[
                            styles.categoryButton,
                            { 
                                backgroundColor: "transparent", 
                                borderColor: colors.primary + "50",
                                borderWidth: 1,
                                borderStyle: "dashed"
                            },
                        ]}
                    >
                        <Ionicons name="add" size={24} color={colors.primary} />
                        <ThemedText style={[styles.categoryButtonText, { color: colors.primary }]}>
                            Add New
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Custom Category Modal */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <KeyboardAvoidingView 
                    style={styles.modalOverlay} 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>Add Custom Category</ThemedText>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        
                        <ThemedText style={[styles.modalSubtitle, { color: colors.secondary }]}>
                            Create a new category for your task.
                        </ThemedText>

                        <TextInput
                            style={[
                                styles.modalInput, 
                                { 
                                    backgroundColor: colors.inputBackground, 
                                    color: colors.text,
                                    borderColor: colors.border
                                }
                            ]}
                            placeholder="e.g. Photography, Transportation"
                            placeholderTextColor={colors.placeholder}
                            value={newCategory}
                            onChangeText={setNewCategory}
                            autoFocus
                        />

                        <TouchableOpacity 
                            style={[styles.modalAddBtn, { backgroundColor: colors.primary }]}
                            onPress={handleAddCategory}
                            activeOpacity={0.8}
                        >
                            <ThemedText style={[styles.modalAddBtnText, { color: colors.primaryContrast }]}>Add Category</ThemedText>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 20,
        padding: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    cardItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    categoryButton: {
        flex: 1,
        minWidth: "45%",
        height: 52,
        borderRadius: 12,
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    defaultIcon: {
        marginRight: 4,
    },
    categoryButtonText: {
        fontWeight: "700",
        fontSize: 14,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        padding: 24,
        borderRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 18,
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    modalInput: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    modalAddBtn: {
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    modalAddBtnText: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
});
