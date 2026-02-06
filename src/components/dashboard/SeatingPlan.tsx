import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface SeatingPlanProps {
    assigned: number;
    total: number;
    onManagePress?: () => void;
}

export function SeatingPlan({ assigned, total, onManagePress }: SeatingPlanProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const percentage = Math.round((assigned / total) * 100);

    // Circular Progress constants
    const size = 100;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <View style={styles.contentRow}>
                <View style={styles.leftSection}>
                    <View style={styles.header}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
                            <MaterialIcons name="chair" size={18} color={colors.primary} />
                        </View>
                        <ThemedText style={[styles.title, { color: colors.primary }]}>
                            Seating Plan
                        </ThemedText>
                    </View>

                    <ThemedText style={styles.assignedText}>
                        {assigned} / {total} Assigned
                    </ThemedText>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary + "CC" }]}
                        onPress={onManagePress}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={styles.buttonText}>Manage Seating</ThemedText>
                    </TouchableOpacity>
                </View>

                <View style={styles.rightSection}>
                    <Svg width={size} height={size}>
                        {/* Background Circle */}
                        <Circle
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke={colors.primary + "15"}
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <Circle
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke={colors.primary}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="none"
                            // Rotate to start from top
                            transform={`rotate(-90, ${center}, ${center})`}
                        />
                    </Svg>
                    <View style={styles.percentageContainer}>
                        <ThemedText style={styles.percentageText}>{percentage}%</ThemedText>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        marginBottom: 40, // More bottom margin for the last item before tab bar
    },
    contentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSection: {
        flex: 1,
        gap: 8,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 4,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    assignedText: {
        fontSize: 14,
        opacity: 0.5,
        fontWeight: "500",
        marginLeft: 2,
    },
    button: {
        marginTop: 8,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 50,
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    rightSection: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20,
    },
    percentageContainer: {
        position: "absolute",
    },
    percentageText: {
        fontSize: 20,
        fontWeight: "800",
    },
});
