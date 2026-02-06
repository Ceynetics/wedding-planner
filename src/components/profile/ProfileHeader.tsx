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
            {/* Background decoration - subtle color section */}
            <View style={[styles.backgroundDecoration, { backgroundColor: colors.primary + "15" }]} />

            <View style={styles.headerContent}>
                <View style={styles.avatarWrapper}>
                    <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + "20" }]}>
                                <Ionicons name="person" size={40} color={colors.primary} />
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.editButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
                        onPress={onEditPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="pencil" size={14} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                    <ThemedText style={[styles.name, { color: colors.primary }]}>{name}</ThemedText>
                    <ThemedText style={[styles.email, { color: colors.primary + "99" }]}>{email}</ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingBottom: 20,
    },
    backgroundDecoration: {
        position: "absolute",
        top: -100, // Extend up beyond safe area
        left: 0,
        right: 0,
        height: 260,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 40,
        gap: 20,
    },
    avatarWrapper: {
        position: "relative",
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        padding: 3,
        overflow: "visible",
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 45,
    },
    avatarPlaceholder: {
        width: "100%",
        height: "100%",
        borderRadius: 45,
        justifyContent: "center",
        alignItems: "center",
    },
    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 26,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    email: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
    },
});
