import { FileHeader } from "@/components/files/FileHeader";
import { FolderCard } from "@/components/files/FolderCard";
import { RecentFileItem } from "@/components/files/RecentFileItem";
import { StorageDetails } from "@/components/files/StorageDetails";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_FOLDERS = (colors: any) => [
    {
        id: "1",
        name: "Contracts",
        fileCount: 12,
        icon: "handshake-outline",
        iconBgColor: colors.expensePurple + "15",
        iconColor: colors.expensePurple,
    },
    {
        id: "2",
        name: "Invoices / Bills",
        fileCount: 12,
        icon: "file-document-outline",
        iconBgColor: colors.success + "15",
        iconColor: colors.success,
    },
    {
        id: "3",
        name: "Invitations",
        fileCount: 12,
        icon: "palette-outline",
        iconBgColor: colors.expensePink + "15",
        iconColor: colors.expensePink,
    },
    {
        id: "4",
        name: "Other Files",
        fileCount: 12,
        icon: "image-outline",
        iconBgColor: colors.warning + "15",
        iconColor: colors.warning,
    },
];

const MOCK_RECENT_FILES = [
    { id: "1", name: "Hotel Payments", module: "module name", size: "file size" },
    { id: "2", name: "Hotel Payments", module: "module name", size: "file size" },
    { id: "3", name: "Hotel Payments", module: "module name", size: "file size" },
    { id: "4", name: "Hotel Payments", module: "module name", size: "file size" },
    { id: "5", name: "Hotel Payments", module: "module name", size: "file size" },
];

export default function FilesScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const folders = MOCK_FOLDERS(colors);

    const gradientColors = (theme === "light"
        ? [colors.primary + "40", colors.primary + "10"]
        : [colors.primary + "60", colors.background]) as [string, string, ...string[]];

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.gradient, { height: 300 + insets.top }]}
            /> */}

            <FileHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
            >
                <StorageDetails used={2.5} total={15} />

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Folders</ThemedText>
                </View>

                <View style={styles.foldersGrid}>
                    {folders.map((folder: any) => (
                        <FolderCard key={folder.id} {...folder} />
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Recently Opened</ThemedText>
                </View>

                <View style={styles.recentList}>
                    {MOCK_RECENT_FILES.map((file) => (
                        <RecentFileItem key={file.id} {...file} />
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="cloud-upload-outline" size={24} color={colors.primaryContrast} style={styles.uploadIcon} />
                    <ThemedText style={[styles.uploadText, { color: colors.primaryContrast }]}>Upload your Documents</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    scrollContent: {
        paddingTop: 10,
    },
    sectionHeader: {
        paddingHorizontal: 24,
        marginTop: 32,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
    },
    foldersGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 24,
    },
    recentList: {
        paddingHorizontal: 24,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 16,
        backgroundColor: 'rgba(255,255,255,0.01)', // Almost transparent to show blurred content behind if needed
    },
    uploadButton: {
        height: 64,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    uploadIcon: {
        marginRight: 10,
    },
    uploadText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
});
