import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
    name: string;
    email: string;
    profileImage?: string;
    onEditPress?: () => void;
}

export function ProfileHeader({ name, email, profileImage, onEditPress }: ProfileHeaderProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            {/* Spacer area (background handled by layout) */}
            <View style={styles.backgroundArea} />

            {/* User details card floating over the background */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                {/* Edit button in top-right corner */}
                <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={onEditPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>

                {/* Avatar */}
                <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + "20" }]}>
                            <Ionicons name="person" size={40} color={colors.primary} />
                        </View>
                    )}
                </View>

                {/* User info */}
                <View style={styles.infoContainer}>
                    <ThemedText style={[styles.name, { color: colors.text }]}>{name}</ThemedText>
                    <ThemedText style={[styles.email, { color: colors.secondary }]}>{email}</ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",
    },
    backgroundArea: {
        width: "100%",
        height: 180,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    card: {
        marginHorizontal: 24,
        marginTop: -100, // Negative margin to overlap the background
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    editButton: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 10,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        padding: 3,
        marginBottom: 16,
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 37,
    },
    avatarPlaceholder: {
        width: "100%",
        height: "100%",
        borderRadius: 37,
        justifyContent: "center",
        alignItems: "center",
    },
    infoContainer: {
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        fontWeight: "500",
    },
});
