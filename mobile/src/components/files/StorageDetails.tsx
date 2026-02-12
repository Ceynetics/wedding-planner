import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface StorageDetailsProps {
    used: number;
    total: number;
}

export function StorageDetails({ used, total }: StorageDetailsProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const progress = used / total;

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondary + "15" }]}>
                    <Image
                        source={require("../../../assets/icons/storage.png")}
                        style={styles.iconImage}
                        resizeMode="contain"
                    />
                </View>
                <ThemedText style={styles.title}>Storage Details</ThemedText>
            </View>

            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${progress * 100}%`, backgroundColor: colors.primary }
                    ]}
                />
            </View>

            <ThemedText style={styles.metaText} lightColor={colors.secondary} darkColor={colors.secondary}>
                {used}GB of {total}GB Used
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 24,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    iconImage: {
        width: 50,
        height: 50,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    progressTrack: {
        height: 12,
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 12,
    },
    progressFill: {
        height: "100%",
        borderRadius: 6,
    },
    metaText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
