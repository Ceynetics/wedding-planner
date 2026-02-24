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

export default function OnboardOneScreen() {
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
                {/* Skip Button */}
                <View style={styles.header}>
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
                            Plan Your Wedding,{'\n'}Together
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: colors.secondary }]}>
                            Invite your partner and plan together with real time updates
                        </ThemedText>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../../assets/images/image_one.png')}
                            style={styles.image}
                            contentFit="contain"
                            transition={500}
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.continueButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/(onboard)/onboard_two' as any)}
                        activeOpacity={0.9}
                    >
                        <ThemedText style={[styles.continueText, { color: colors.primaryContrast }]}>Continue</ThemedText>
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
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 10,
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
        marginTop: 220,
    },
    image: {
        width: width * 2,
        height: height * 0.65,
        margin: -20,
        marginTop: -150
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 20,
    },
    continueButton: {
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
    continueText: {
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
});
