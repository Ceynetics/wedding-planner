import { FloorCanvas, FloorCanvasRef } from "@/components/seating/FloorCanvas";
import { FloatingControls } from "@/components/seating/FloatingControls";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * FloorPlanScreen - A screen to visualize and manage table arrangements on a 2D canvas.
 * This screen allows users to drag tables around to set up the venue floor plan.
 */
export default function FloorPlanScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();
    const router = useRouter();

    // Ref to access zoom methods in FloorCanvas
    const canvasRef = useRef<FloorCanvasRef>(null);

    // Initial mock data with positions
    const [tables, setTables] = useState([
        { id: "1", name: "Head Table 1", description: "Table 1", currentGuests: 7, maxGuests: 10, isVip: true, x: 0, y: -150 },
        { id: "2", name: "Guest Table 2", description: "Table 2", currentGuests: 5, maxGuests: 8, isVip: false, x: -120, y: 0 },
        { id: "3", name: "Guest Table 3", description: "Table 3", currentGuests: 8, maxGuests: 8, isVip: false, x: 120, y: 0 },
        { id: "4", name: "VIP Table 4", description: "Table 4", currentGuests: 6, maxGuests: 10, isVip: true, x: 0, y: 150 },
    ]);

    const handleTableMove = (id: string, x: number, y: number) => {
        setTables(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    };

    /**
     * handleAddTable - Adds a new table to the workspace.
     */
    const handleAddTable = () => {
        const newId = (tables.length + 1).toString();
        const newTable = {
            id: newId,
            name: `Table ${newId}`,
            description: `Table ${newId}`,
            currentGuests: 0,
            maxGuests: 8,
            isVip: false,
            x: 0,
            y: 0,
        };
        setTables([...tables, newTable]);
    };

    /**
     * handleChangeShape - Toggles table shapes (Placeholder for next stage).
     */
    const handleChangeShape = () => {
        Alert.alert("Customize Shape", "Interactive shape selection and rotation will be implemented in the next stage.");
    };

    return (
        <ThemedView style={styles.container}>
            {/* Custom Header with Download action */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <ThemedText style={styles.title}>Floor Plan</ThemedText>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.headerIconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => {
                            console.log("Exporting floor plan...");
                        }}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons name="download-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Interactive Floor Canvas */}
            <FloorCanvas
                ref={canvasRef}
                tables={tables}
                theme={theme}
                onTableMove={handleTableMove}
            />

            {/* Floating Interaction Controls */}
            <FloatingControls
                onZoomIn={() => canvasRef.current?.zoomIn()}
                onZoomOut={() => canvasRef.current?.zoomOut()}
                onAddTable={handleAddTable}
                onChangeShape={handleChangeShape}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 20,
        zIndex: 10,
    },
    backButton: {
        width: 60,
        height: 48,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
    },
    headerActions: {
        width: 60, // Symmetrically balanced with backButton
        alignItems: "flex-end",
    },
    headerIconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    canvasContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    placeholderIcon: {
        marginBottom: 20,
        opacity: 0.4,
    },
    placeholderText: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
    },
    placeholderSubtext: {
        fontSize: 16,
        opacity: 0.5,
        textAlign: "center",
        lineHeight: 22,
    },
});
