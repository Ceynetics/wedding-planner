import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SeatingHeader() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.primaryContrast} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <ThemedText style={[styles.title, { color: colors.primaryContrast }]}>Seating</ThemedText>
            </View>

            {/* Empty view to perfectly balance the 48px back button and strictly center the title */}
            <View style={{ width: 48 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 20,
        zIndex: 10,
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
