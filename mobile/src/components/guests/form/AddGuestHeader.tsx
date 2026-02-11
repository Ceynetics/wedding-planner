import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

export function AddGuestHeader() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: 20, backgroundColor: colors.background }]}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={[styles.backButton, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="arrow-back" size={24} color={colors.emphasis} />
            </TouchableOpacity>
            <ThemedText
                style={[styles.title, { color: colors.emphasis }]}
                numberOfLines={1}
            >
                Add your Guests
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 16,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24, // Circle
        justifyContent: "center",
        alignItems: "center",
        // Subtle shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: -0.5,
    },
});
