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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { theme } = useAppTheme();
  const colors = Colors[theme];

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
              <View
                style={[
                  styles.logoContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons name="leaf" size={40} color={colors.primary} />
              </View>
              <ThemedText type="title" style={styles.title}>
                Welcome Back
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to continue your journey
              </ThemedText>
            </View>

            <View style={styles.form}>
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
                placeholder="Enter your password"
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

              <TouchableOpacity style={styles.forgotPassword}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{ color: colors.primary }}
                >
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>

              <PrimaryButton
                title="Sign In"
                onPress={() => router.push("/(tabs)" as any)}
                loading={loading}
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
                  Sign In with Google
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
                  Sign In with Apple
                </ThemedText>
              </TouchableOpacity>

              <View style={styles.footer}>
                <ThemedText>Don't have an account? </ThemedText>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/register" as any)}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: colors.primary }}
                  >
                    Sign Up
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
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.6,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
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
    elevation: 3,
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
    marginTop: 32,
  },
});
