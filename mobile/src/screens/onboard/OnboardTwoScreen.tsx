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
import { ThemedView } from '@/components/ThemedView';

const { width, height } = Dimensions.get('window');

export default function OnboardTwoScreen() {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const router = useRouter();

    const isDark = theme === 'dark';

    const gradientColors = isDark
        ? [colors.background, colors.card] as [string, string, ...string[]]
        : [colors.primary + '15', colors.background] as [string, string, ...string[]];

    return (
        <ThemedView style={styles.container}>
            <LinearGradient
                colors={gradientColors}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header with Back and Skip */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: colors.card }]}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => router.push('/(auth)/login' as any)}
                        activeOpacity={0.7}
                    >
                        <ThemedText style={[styles.skipText, { color: colors.primary }]}>Skip</ThemedText>
                        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <ThemedText style={[styles.title, { color: colors.text }]}>
                            All Your Wedding,{'\n'}One Place
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                            Manage tasks, vendors, budgets, Guests and even the Invitations without any stress.
                        </ThemedText>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../../assets/images/image_two.png')}
                            style={styles.image}
                            contentFit="contain"
                            transition={500}
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/(auth)/register' as any)}
                        activeOpacity={0.9}
                    >
                        <ThemedText style={[styles.buttonText, { color: colors.primaryContrast }]}>Create Account</ThemedText>
                        <Ionicons name="arrow-forward" size={20} color={colors.primaryContrast} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ThemedView>
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
        lineHeight: 42,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
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
        height: height * 0.52,
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
        marginRight: 8,
    },
});
