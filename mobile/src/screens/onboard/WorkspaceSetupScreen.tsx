import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

/**
 * WorkspaceSelectionScreen Component
 * 
 * Provides two primary options for the user when starting:
 * 1. Scan a QR code to join an existing workspace.
 * 2. Create a brand new workspace.
 */
export default function WorkspaceSelectionScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                <View style={styles.content}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <ThemedText style={[styles.welcomeMsg, { color: colors.primary }]}>
                            Connect & Organize
                        </ThemedText>
                        <ThemedText type="title" style={[styles.title, { color: colors.emphasis || colors.primary }]}>
                            How would you like to start?
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                            Join an existing team or launch your own wedding workspace
                        </ThemedText>
                    </View>

                    {/* Central Illustration Section */}
                    <View style={styles.illustrationContainer}>
                        <Image
                            source={require("@/../assets/images/scanQR.png")}
                            style={styles.illustration}
                            contentFit="contain"
                        />
                    </View>

                    {/* Action Buttons Section */}
                    <View style={styles.actionContainer}>
                        {/* Option 1: Scan QR Code */}
                        <TouchableOpacity
                            style={[styles.outlineBtn, { borderColor: colors.primary }]}
                            onPress={() => console.log("Navigate to QR Scanner")}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="qr-code-outline" size={24} color={colors.primary} />
                            <View style={styles.btnTextContainer}>
                                <ThemedText style={[styles.btnTitle, { color: colors.primary }]}>
                                    Scan QR Code
                                </ThemedText>
                                <ThemedText style={[styles.btnSubtitle, { color: colors.secondary }]}>
                                    Join a workspace via invitation
                                </ThemedText>
                            </View>
                        </TouchableOpacity>

                        {/* Option 2: Create New Workspace */}
                        <PrimaryButton
                            title="Create New Workspace"
                            onPress={() => router.push("/(onboard)/workspace" as any)}
                            style={styles.primaryBtn}
                        />
                        
                        <ThemedText style={[styles.footerText, { color: colors.secondary }]}>
                            You can always change these settings later in your profile.
                        </ThemedText>
                    </View>
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
        justifyContent: "space-between",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    welcomeMsg: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 12,
        lineHeight: 34,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.7,
        lineHeight: 22,
        paddingHorizontal: 15,
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    illustration: {
        width: width * 0.75,
        height: width * 0.75,
    },
    actionContainer: {
        width: "100%",
        gap: 16,
    },
    outlineBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        borderRadius: 20,
        borderWidth: 1.5,
        borderStyle: "dashed",
        backgroundColor: "transparent",
    },
    btnTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    btnTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 2,
    },
    btnSubtitle: {
        fontSize: 13,
        opacity: 0.6,
    },
    primaryBtn: {
        height: 64,
        borderRadius: 20,
    },
    footerText: {
        fontSize: 12,
        textAlign: "center",
        opacity: 0.5,
        marginTop: 8,
    },
});
