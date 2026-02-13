import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { ThemedText } from '@/components/ThemedText';

const { width, height } = Dimensions.get('window');

export default function OnboardTwoScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    const isDark = theme === 'dark';

    const DESIGN_COLORS = {
        primaryPurple: '#9333EA',
        darkPurple: '#2E1065',
        grayText: '#4B5563',
        bgGradient: ['#E9D5FF', '#FBCFE8', '#FAE8FF'] as const,
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={DESIGN_COLORS.bgGradient as any}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header with Back and Skip */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={DESIGN_COLORS.darkPurple} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => router.push('/(auth)/login' as any)}
                        activeOpacity={0.7}
                    >
                        <ThemedText style={styles.skipText}>Skip</ThemedText>
                        <Ionicons name="chevron-forward" size={18} color={DESIGN_COLORS.darkPurple} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <ThemedText style={styles.title}>
                            All Your Wedding,{'\n'}One Place
                        </ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Manage tasks, vendors, budgets, Guests and even the Invitations without any stress.
                        </ThemedText>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../../assets/images/onboard_two.png')}
                            style={styles.image}
                            contentFit="contain"
                            transition={500}
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: isDark ? colors.expensePurple : DESIGN_COLORS.primaryPurple }]}
                        onPress={() => router.push('/(auth)/register' as any)}
                        activeOpacity={0.9}
                    >
                        <ThemedText style={styles.buttonText}>Create Account</ThemedText>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    skipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2E1065',
        marginRight: 2,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    textContainer: {
        paddingHorizontal: 40,
        paddingTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: width > 400 ? 34 : 30,
        fontWeight: '900',
        textAlign: 'center',
        color: '#2E1065',
        lineHeight: 42,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#4B5563',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: width * 2,
        height: height * 0.55,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 20,
    },
    primaryButton: {
        flexDirection: 'row',
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginRight: 8,
    },
});
