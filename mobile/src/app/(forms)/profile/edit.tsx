import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileEditHeader } from '@/components/profile/ProfileEditHeader';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { extractErrorMessage } from '@/utils/errors';
import { required } from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';

/**
 * EditProfileScreen - A premium form to update user profile information.
 */
export default function EditProfileScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<{ name?: string }>({});

    useEffect(() => {
        if (user) {
            setName(user.fullName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setBio(user.bio || '');
        }
    }, [user]);

    const handleSave = async () => {
        const nameError = required(name, 'Full name');
        if (nameError) { setErrors({ name: nameError }); return; }
        setErrors({});
        setError('');
        setLoading(true);
        try {
            await updateUser({ fullName: name, phone, bio });
            router.back();
        } catch (e) {
            setError(extractErrorMessage(e));
        } finally {
            setLoading(false);
        }
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
                        onChangeText={(v) => { setName(v); setErrors(prev => ({ ...prev, name: undefined })); }}
                        placeholder="Enter your name"
                        leftIcon={<Ionicons name="person-outline" size={20} color={colors.secondary} />}
                        error={errors.name}
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

                    <TextField
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                        leftIcon={<Ionicons name="call-outline" size={20} color={colors.secondary} />}
                    />

                    <TextField
                        label="Bio"
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself"
                        multiline
                        numberOfLines={4}
                        leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.secondary} />}
                        inputContainerStyle={styles.textArea}
                    />

                </View>

                {error ? (
                    <ThemedText style={{ color: colors.error, textAlign: 'center', marginBottom: 12 }}>{error}</ThemedText>
                ) : null}

                {/* Save Button */}
                <PrimaryButton
                    title="Save Changes"
                    onPress={handleSave}
                    loading={loading}
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
