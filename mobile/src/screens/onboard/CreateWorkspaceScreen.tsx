import { DatePicker } from "@/components/DatePicker";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextField } from "@/components/TextField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateWorkspaceScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    const [eventName, setEventName] = useState("");
    const [venue, setVenue] = useState("Colombo");
    const [eventDate, setEventDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    const formatDate = (date: Date) => {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        return `${d < 10 ? "0" + d : d} / ${m < 10 ? "0" + m : m} / ${y}`;
    };

    const handleCreateWorkspace = () => {
        // Navigate to dashboard after workspace creation
        router.replace("/(tabs)");
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={styles.mainContent}>
                        <View style={styles.header}>
                            <ThemedText style={[styles.welcomeMsg, { color: colors.primary }]}>
                                Welcome! Let's get started
                            </ThemedText>
                            <ThemedText type="title" style={[styles.title, { color: colors.emphasis || colors.primary }]}>
                                Create your Workspace
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                                Add your partner or team mates to the workspace
                            </ThemedText>
                        </View>

                        <View style={styles.formSection}>
                            <TextField
                                label="Event Name"
                                placeholder="e.g : Our Wedding"
                                value={eventName}
                                onChangeText={setEventName}
                                containerStyle={styles.fieldMargin}
                            />

                            <View style={styles.row}>
                                <View style={styles.halfField}>
                                    <ThemedText type="label" style={styles.fieldLabel}>Date</ThemedText>
                                    <TouchableOpacity
                                        style={[styles.selector, { backgroundColor: colors.inputBackground }]}
                                        onPress={() => setShowDatePicker(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="calendar" size={20} color={colors.secondary} />
                                        <ThemedText style={[styles.selectorText, { color: colors.text }]}>
                                            {formatDate(eventDate)}
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.halfField}>
                                    <TextField
                                        label="Venue"
                                        placeholder="Colombo"
                                        value={venue}
                                        onChangeText={setVenue}
                                        leftIcon={<Ionicons name="location" size={20} color={colors.secondary} />}
                                    />
                                </View>
                            </View>

                            <View style={styles.partnersSection}>
                                <ThemedText type="label" style={styles.fieldLabel}>
                                    Partners & Roles
                                </ThemedText>
                                <View style={[styles.partnersCard, { backgroundColor: colors.card }]}>
                                    <View style={styles.avatarsRow}>
                                        <Image
                                            source="https://i.pravatar.cc/150?u=1"
                                            style={styles.avatar}
                                        />
                                        <Image
                                            source="https://i.pravatar.cc/150?u=2"
                                            style={styles.avatar}
                                        />
                                        <Image
                                            source="https://i.pravatar.cc/150?u=3"
                                            style={styles.avatar}
                                        />
                                        <TouchableOpacity style={[styles.addAvatarBtn, { borderColor: colors.primary + "30" }]}>
                                            <Ionicons name="add" size={24} color={colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.inviteContainer}>
                                <View style={styles.inviteWrapper}>
                                    <TextField
                                        placeholder="Invite Partner via Email"
                                        value={inviteEmail}
                                        onChangeText={setInviteEmail}
                                        containerStyle={{ flex: 1, marginBottom: 0 }}
                                        inputContainerStyle={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                    />
                                    <TouchableOpacity style={[styles.inviteBtn, { backgroundColor: colors.primary }]}>
                                        <Ionicons name="arrow-forward" size={24} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.dividerRow}>
                                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                                <ThemedText style={[styles.dividerText, { color: colors.secondary }]}>Or</ThemedText>
                                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                            </View>

                            <TouchableOpacity
                                style={[styles.shareBtn, { backgroundColor: colors.primary + "10" }]}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
                                <ThemedText style={[styles.shareText, { color: colors.primary }]}>
                                    Share Pairing Code
                                </ThemedText>
                            </TouchableOpacity>

                            <PrimaryButton
                                title="Create Workspace"
                                onPress={handleCreateWorkspace}
                                style={styles.createBtn}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <DatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                value={eventDate}
                onChange={setEventDate}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 28,
    },
    welcomeMsg: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        textAlign: "center",
        opacity: 0.8,
        paddingHorizontal: 20,
    },
    formSection: {
        flex: 1,
    },
    fieldMargin: {
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    halfField: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 8,
        marginLeft: 4,
    },
    selector: {
        height: 56,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    selectorText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "500",
    },
    partnersSection: {
        marginBottom: 20,
    },
    partnersCard: {
        borderRadius: 20,
        padding: 16,
    },
    avatarsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: "#FFF",
    },
    addAvatarBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderStyle: "dashed",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    inviteContainer: {
        marginBottom: 24,
    },
    inviteWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    inviteBtn: {
        height: 56,
        width: 56,
        borderRadius: 16,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        opacity: 0.2,
    },
    dividerText: {
        fontSize: 14,
        fontWeight: "600",
        marginHorizontal: 16,
    },
    shareBtn: {
        height: 56,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    shareText: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 10,
    },
    createBtn: {
        marginTop: "auto",
        marginBottom: 10,
    },
});
