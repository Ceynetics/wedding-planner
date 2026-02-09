import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function FileHeader() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <ThemedText style={styles.title}>My Files</ThemedText>
                </View>

                {/* Empty view for balance */}
                <View style={styles.backButton} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 10,
        zIndex: 10,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
    },
});
