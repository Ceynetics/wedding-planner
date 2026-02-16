import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

export function TaskAssignmentSection() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                        <Ionicons name="person-add-outline" size={20} color={colors.text} />
                    </View>
                    <ThemedText style={styles.cardItemText}>Assign To</ThemedText>
                </View>
                <View style={styles.avatarContainer}>
                    {[1, 2, 3].map((i) => (
                        <Image
                            key={i}
                            source={{ uri: `https://i.pravatar.cc/150?u=${i + 10}` }}
                            style={styles.avatar}
                        />
                    ))}
                    <TouchableOpacity style={[styles.addAvatar, { borderColor: colors.primary + "40" }]}>
                        <Ionicons name="add" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
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
        shadowColor: "#000",
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
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    addAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1.5,
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
    },
});
