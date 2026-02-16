import { PrimaryButton } from "@/components/PrimaryButton";
import { TextField } from "@/components/TextField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
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

const genderOptions = ["Male", "Female", "Other"];

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const handleRegister = () => {
        setLoading(true);
        // Simulate register
        setTimeout(() => {
            setLoading(false);
            router.push("/(tabs)" as any);
        }, 2000);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.header}>
                            <Image
                                source={require("../../../assets/icons/hearts.png")}
                                style={styles.headerImage}
                                contentFit="contain"
                            />
                            <View style={styles.headerTextContainer}>
                                <ThemedText type="title" style={styles.title}>
                                    Create Account
                                </ThemedText>
                                <ThemedText style={styles.subtitle}>
                                    Join us and start planning your perfect day
                                </ThemedText>
                            </View>
                        </View>

                        <View style={styles.form}>
                            <TextField
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={setName}
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 12 }}>
                                    <TextField
                                        label="Age"
                                        placeholder="25"
                                        value={age}
                                        onChangeText={setAge}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 2 }}>
                                    {/* Gender Selection with Dropdown */}
                                    <View style={styles.dropdownContainer}>
                                        <ThemedText type="label" style={styles.label}>
                                            Gender
                                        </ThemedText>
                                        <TouchableOpacity
                                            style={[
                                                styles.dropdownTrigger,
                                                {
                                                    backgroundColor: colors.inputBackground,
                                                    borderBottomLeftRadius: isGenderDropdownOpen ? 0 : 16,
                                                    borderBottomRightRadius: isGenderDropdownOpen ? 0 : 16,
                                                },
                                            ]}
                                            onPress={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                                            activeOpacity={0.7}
                                        >
                                            <ThemedText
                                                style={[
                                                    styles.dropdownValue,
                                                    { color: gender ? colors.text : colors.placeholder },
                                                ]}
                                            >
                                                {gender || "Select gender"}
                                            </ThemedText>
                                            <Ionicons
                                                name={isGenderDropdownOpen ? "chevron-up" : "chevron-down"}
                                                size={20}
                                                color={colors.secondary}
                                            />
                                        </TouchableOpacity>

                                        {/* Inline Dropdown Options */}
                                        {isGenderDropdownOpen && (
                                            <View style={[styles.optionsList, { backgroundColor: colors.inputBackground, borderColor: colors.border + "20" }]}>
                                                {genderOptions.map((option, index) => (
                                                    <TouchableOpacity
                                                        key={option}
                                                        style={[
                                                            styles.optionItem,
                                                            index === genderOptions.length - 1 && { borderBottomWidth: 0 }
                                                        ]}
                                                        onPress={() => {
                                                            setGender(option);
                                                            setIsGenderDropdownOpen(false);
                                                        }}
                                                    >
                                                        <ThemedText
                                                            style={[
                                                                styles.optionText,
                                                                gender === option && { color: colors.primary, fontWeight: '700' }
                                                            ]}
                                                        >
                                                            {option}
                                                        </ThemedText>
                                                        {gender === option && (
                                                            <Ionicons name="checkmark" size={18} color={colors.primary} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <TextField
                                label="Email Address"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextField
                                label="Password"
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                rightIcon={
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={colors.secondary}
                                        />
                                    </TouchableOpacity>
                                }
                            />

                            <PrimaryButton
                                title="Sign Up"
                                onPress={handleRegister}
                                loading={loading}
                                style={styles.button}
                            />

                            <View style={styles.dividerContainer}>
                                <View
                                    style={[styles.dividerLine, { backgroundColor: colors.border }]}
                                />
                                <ThemedText style={styles.dividerText}>Or</ThemedText>
                                <View
                                    style={[styles.dividerLine, { backgroundColor: colors.border }]}
                                />
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.socialButton,
                                    { backgroundColor: colors.card },
                                ]}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={require("../../../assets/icons/google.png")}
                                    style={styles.googleIcon}
                                    contentFit="contain"
                                />
                                <ThemedText style={styles.socialText}>
                                    Sign Up with Google
                                </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.socialButton,
                                    { backgroundColor: colors.card },
                                ]}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="logo-apple"
                                    size={22}
                                    color={colors.text}
                                    style={styles.socialIcon}
                                />
                                <ThemedText style={styles.socialText}>
                                    Sign Up with Apple
                                </ThemedText>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <ThemedText>Already have an account? </ThemedText>
                                <TouchableOpacity
                                    onPress={() => router.push("/(auth)/login" as any)}
                                >
                                    <ThemedText
                                        type="defaultSemiBold"
                                        style={{ color: colors.primary }}
                                    >
                                        Sign In
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 48,
    },
    headerImage: {
        width: 60,
        height: 60,
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.6,
        fontSize: 14.5
    },
    form: {
        width: "100%",
    },
    row: {
        flexDirection: "row",
        width: "100%",
    },
    button: {
        marginTop: 10,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 12,
        opacity: 0.5,
        fontSize: 14,
    },
    socialButton: {
        flexDirection: "row",
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    socialIcon: {
        marginRight: 10,
    },
    socialText: {
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    // Gender Dropdown Styles
    dropdownContainer: {
        marginBottom: 20,
        zIndex: 10,
    },
    label: {
        marginBottom: 8,
        marginLeft: 4,
    },
    dropdownTrigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    dropdownValue: {
        fontSize: 16,
    },
    optionsList: {
        position: 'absolute',
        top: 84, // Label height + trigger height
        left: 0,
        right: 0,
        borderRadius: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingHorizontal: 4,
        zIndex: 100,
        // Shadow for the opened dropdown
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderTopWidth: 0,
    },
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    optionText: {
        fontSize: 15,
        fontWeight: "500",
    },
});
