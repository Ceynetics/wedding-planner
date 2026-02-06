import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const handleRegister = () => {
        setLoading(true);
        // Simulate register
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>

                        <View style={styles.header}>
                            <View style={[styles.logoContainer, { backgroundColor: colors.primary + '20' }]}>
                                <Ionicons name="person-add" size={40} color={colors.primary} />
                            </View>
                            <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
                            <ThemedText style={styles.subtitle}>Join us and start your journey</ThemedText>
                        </View>

                        <View style={styles.form}>
                            <TextField
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={setName}
                            />

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
                                secureTextEntry
                            />

                            <PrimaryButton
                                title="Sign Up"
                                onPress={handleRegister}
                                loading={loading}
                                style={styles.button}
                            />

                            <View style={styles.footer}>
                                <ThemedText>Already have an account? </ThemedText>
                                <TouchableOpacity onPress={() => router.push('/' as any)}>
                                    <ThemedText type="defaultSemiBold" style={{ color: colors.primary }}>
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
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        opacity: 0.6,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
});