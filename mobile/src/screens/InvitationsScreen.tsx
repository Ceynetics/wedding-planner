import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useInvitations } from "@/hooks/useInvitations";
import { extractErrorMessage } from "@/utils/errors";
import { InvitationCard } from "../components/invitations/InvitationCard";
import { AddCardButton } from "../components/invitations/AddCardButton";
import { InvitationTabs } from "../components/invitations/InvitationTabs";
import { DesignPreview } from "../components/invitations/editor/DesignPreview";
import { CustomizeContent } from "../components/invitations/editor/CustomizeContent";
import { GuestDetailsSection } from "../components/invitations/editor/GuestDetailsSection";
import { EditorOptions } from "../components/invitations/editor/EditorOptions";

export default function InvitationsScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { invitations, templates: apiTemplates, isLoading, createInvitation, generateInvitation } = useInvitations();
    const [activeTab, setActiveTab] = useState<"Cards" | "Editor">("Cards");
    const [selectedTemplateId, setSelectedTemplateId] = useState("1");

    // Editor State - Content
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState("");
    const [venue, setVenue] = useState("");

    // Editor State - Guest Info
    const [title, setTitle] = useState("Mrs.");
    const [guestName, setGuestName] = useState("");
    const [guestType, setGuestType] = useState<'You' | 'You Two' | 'Family'>('You');

    // Editor State - Options
    const [selectedColor, setSelectedColor] = useState("#E74C3C");
    const [isVipGuest, setIsVipGuest] = useState(false);

    // Template names when API templates are not available
    const DEFAULT_TEMPLATES = [
        { id: '1', title: 'Elegant Floral', image: undefined },
        { id: '2', title: 'Classic Gold', image: undefined },
        { id: '3', title: 'Modern Minimal', image: undefined },
    ];

    const templates = apiTemplates.length > 0
        ? apiTemplates.map((t) => ({ id: t.id, title: t.displayName, image: undefined as string | undefined }))
        : DEFAULT_TEMPLATES;

    const handleExport = async () => {
        // Find the most recently created invitation to export
        const latest = invitations[invitations.length - 1];
        if (!latest) { Alert.alert("No Invitation", "Create an invitation first."); return; }
        try {
            await generateInvitation(latest.id, 'PDF');
            Alert.alert("Success", "PDF generated successfully.");
        } catch (err) {
            Alert.alert("Export Failed", extractErrorMessage(err));
        }
    };

    const handleShare = () => console.log("Sharing Invitation...");

    const handleSaveInvitation = async () => {
        try {
            await createInvitation({
                templateId: selectedTemplateId,
                name1,
                name2,
                eventDate: eventDate.toISOString().split('T')[0],
                eventTime,
                venue,
                selectedColor,
                isVipGuest: isVipGuest,
                greeting: `Dear ${title} ${guestName}`,
                addressLine: `${title} ${guestName}`,
            });
            Alert.alert("Success", "Invitation created successfully.");
            setActiveTab("Cards");
        } catch (err) {
            Alert.alert("Error", extractErrorMessage(err));
        }
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButton]}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.primaryContrast} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={[styles.headerTitle, { color: colors.primaryContrast }]}>Invitations</ThemedText>
                    <View style={{ width: 44 }} />
                </View>

                <InvitationTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {activeTab === "Cards" ? (
                        <>
                            <ThemedText style={[styles.sectionTitle, { color: colors.emphasis || colors.primary }]}>
                                Your Card Designs
                            </ThemedText>

                            {isLoading ? (
                                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                            ) : (
                                <View style={styles.grid}>
                                    {(invitations.length > 0
                                        ? invitations.map((inv) => {
                                            const tpl = templates.find(t => t.id === inv.templateId);
                                            return (
                                                <View key={inv.id} style={styles.cardWrapper}>
                                                    <InvitationCard
                                                        title={inv.name1 && inv.name2 ? `${inv.name1} & ${inv.name2}` : tpl?.title ?? `Invitation #${inv.id}`}
                                                        image={tpl?.image}
                                                    />
                                                </View>
                                            );
                                        })
                                        : templates.map((item) => (
                                            <View key={item.id} style={styles.cardWrapper}>
                                                <InvitationCard title={item.title} image={item.image} />
                                            </View>
                                        ))
                                    )}
                                    <View style={styles.cardWrapper}>
                                        <AddCardButton />
                                    </View>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <DesignPreview
                                templates={templates}
                                selectedTemplateId={selectedTemplateId}
                                onSelectTemplate={setSelectedTemplateId}
                            />
                            <CustomizeContent
                                name1={name1}
                                onName1Change={setName1}
                                name2={name2}
                                onName2Change={setName2}
                                date={eventDate}
                                onDateChange={setEventDate}
                                time={eventTime}
                                onTimeChange={setEventTime}
                                venue={venue}
                                onVenueChange={setVenue}
                            />
                            <GuestDetailsSection
                                title={title}
                                onTitleChange={setTitle}
                                guestName={guestName}
                                onGuestNameChange={setGuestName}
                                guestType={guestType}
                                onGuestTypeChange={setGuestType}
                            />
                            <EditorOptions
                                selectedColor={selectedColor}
                                onColorSelect={setSelectedColor}
                                isVip={isVipGuest}
                                onVipChange={setIsVipGuest}
                                onExport={handleExport}
                                onShare={handleShare}
                            />
                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                                onPress={handleSaveInvitation}
                                activeOpacity={0.8}
                            >
                                <ThemedText style={[styles.saveButtonText, { color: colors.primaryContrast }]}>
                                    Save Invitation
                                </ThemedText>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
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
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 24,
        marginBottom: 20,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },
    cardWrapper: {
        width: "47%",
        marginBottom: 8,
    },
    saveButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    saveButtonText: {
        fontSize: 17,
        fontWeight: "700",
    },
});
