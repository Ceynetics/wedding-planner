import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
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

    const handleExport = () => console.log("Exporting PDF...");
    const handleShare = () => console.log("Sharing Invitation...");

    const templates = [
        { id: "1", title: "Template #1", image: "https://marketplace.canva.com/EAFZ_mQJ20w/1/0/1143w/canva-black-gold-elegant-floral-wedding-invitation-A-f6W-yH1G4.jpg" },
        { id: "2", title: "Template #2", image: "https://marketplace.canva.com/EAFf7M1e7oQ/1/0/1143w/canva-white-and-green-floral-elegant-wedding-invitation-0pT_B8p0fM0.jpg" },
        { id: "3", title: "Template #3", image: "https://marketplace.canva.com/EAFiS1R9f9M/1/0/1143w/canva-cream-and-gold-minimalist-wedding-invitation-q7X_A7X_A7X.jpg" },
        { id: "4", title: "Template #3", image: "https://marketplace.canva.com/EAFiS1R9f9M/1/0/1143w/canva-cream-and-gold-minimalist-wedding-invitation-q7X_A7X_A7X.jpg" },
        { id: "5", title: "Template #3", image: "https://marketplace.canva.com/EAFiS1R9f9M/1/0/1143w/canva-cream-and-gold-minimalist-wedding-invitation-q7X_A7X_A7X.jpg" },
        { id: "6", title: "Template #3", image: "https://marketplace.canva.com/EAFiS1R9f9M/1/0/1143w/canva-cream-and-gold-minimalist-wedding-invitation-q7X_A7X_A7X.jpg" },
        { id: "7", title: "Template #2", image: "https://marketplace.canva.com/EAFf7M1e7oQ/1/0/1143w/canva-white-and-green-floral-elegant-wedding-invitation-0pT_B8p0fM0.jpg" },
        { id: "8", title: "Template #1", image: "https://marketplace.canva.com/EAFZ_mQJ20w/1/0/1143w/canva-black-gold-elegant-floral-wedding-invitation-A-f6W-yH1G4.jpg" },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButton]}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.headerTitle}>Invitations</ThemedText>
                    <View style={{ width: 44 }} />
                </View>

                <InvitationTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {activeTab === "Cards" ? (
                        <>
                            <ThemedText style={[styles.sectionTitle, { color: colors.emphasis || colors.primary }]}>
                                Your Card Designs
                            </ThemedText>

                            <View style={styles.grid}>
                                {templates.map((item) => (
                                    <View key={item.id} style={styles.cardWrapper}>
                                        <InvitationCard title={item.title} image={item.image} />
                                    </View>
                                ))}
                                <View style={styles.cardWrapper}>
                                    <AddCardButton />
                                </View>
                            </View>
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
    },
    cardWrapper: {
        width: "30%", // 3 columns
        marginBottom: 24,
    },
});
