import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileEditHeader } from '@/components/profile/ProfileEditHeader';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

/**
 * EditProfileScreen - A premium form to update user profile information.
 */
export default function EditProfileScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    // State initialized with current user data (mocked)
    const [name, setName] = useState('John Michael');
    const [email, setEmail] = useState('john@gmail.com');
    const [phone, setPhone] = useState('+1 234 567 890');
    const [bio, setBio] = useState('I love planning beautiful weddings and making dreams come true.');

    /**
     * Handles saving profile changes
     */
    const handleSave = () => {
        // Implementation for updating profile
        console.log('Saving profile:', { name, email, phone, bio });
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <ProfileEditHeader />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar Edit Section */}
                <View style={styles.avatarSection}>
                    <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + "20" }]}>
                            <Ionicons name="person" size={50} color={colors.primary} />
                        </View>
                        <TouchableOpacity
                            style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="camera" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <ThemedText style={[styles.changeCaption, { color: colors.secondary }]}>
                        Tap to change profile picture
                    </ThemedText>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                    <TextField
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        leftIcon={<Ionicons name="person-outline" size={20} color={colors.secondary} />}
                    />

                    <TextField
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.secondary} />}
                    />

                </View>

                {/* Save Button */}
                <PrimaryButton
                    title="Save Changes"
                    onPress={handleSave}
                    style={styles.saveButton}
                />

                {/* Optional: Cancel text button */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <ThemedText style={[styles.cancelText, { color: colors.secondary }]}>
                        Discard Changes
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 32,
    },
    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        padding: 4,
        position: 'relative',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    changeCaption: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '500',
    },
    formSection: {
        marginBottom: 32,
    },
    textArea: {
        minHeight: 120,
        alignItems: 'flex-start',
        paddingTop: 12,
    },
    saveButton: {
        height: 60,
        borderRadius: 16,
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
