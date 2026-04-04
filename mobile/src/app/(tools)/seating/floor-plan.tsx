import { FloorCanvas, FloorCanvasRef } from "@/components/seating/FloorCanvas";
import { FloatingControls } from "@/components/seating/FloatingControls";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSeatingTables } from "@/hooks/useSeatingTables";
import React, { useState, useRef, useCallback, useEffect } from "react";
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

    const canvasRef = useRef<FloorCanvasRef>(null);
    const { tables: apiTables, updatePosition } = useSeatingTables();

    // Map API tables to canvas format
    const tables = apiTables.map(t => ({
        id: String(t.id),
        name: t.name,
        description: t.tableShape || 'Table',
        currentGuests: t.seatedCount,
        maxGuests: t.chairCount || 0,
        isVip: t.isVip,
        x: t.positionX || 0,
        y: t.positionY || 0,
    }));

    // Debounce timer ref
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTableMove = useCallback((id: string, x: number, y: number) => {
        // Debounced position persist to backend
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            updatePosition(Number(id), { positionX: x, positionY: y });
        }, 300);
    }, [updatePosition]);

    const handleAddTable = () => {
        router.push("/(forms)/seating/add" as any);
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
