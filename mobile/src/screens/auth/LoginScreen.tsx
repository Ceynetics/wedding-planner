import { PrimaryButton } from "@/components/PrimaryButton";
import { TextField } from "@/components/TextField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { extractErrorMessage } from "@/utils/errors";
import { required, email as emailValidator, minLength, validate } from '@/utils/validation';
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
  const [errors, setErrors] = useState<{email?: string; password?: string; form?: string}>({});
  const router = useRouter();
  const { login } = useAuth();

  const { theme } = useAppTheme();
  const colors = Colors[theme];

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    newErrors.email = validate(email, (v) => required(v, 'Email'), emailValidator);
    newErrors.password = validate(password, (v) => required(v, 'Password'), (v) => minLength(v, 6, 'Password'));
    if (newErrors.email || newErrors.password) { setErrors(newErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (e) {
      setErrors({ form: extractErrorMessage(e) });
    } finally {
      setLoading(false);
    }
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
                  Welcome Back
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Sign in to continue your journey
                </ThemedText>
              </View>
            </View>

            <View style={styles.form}>
              <TextField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={(v) => { setEmail(v); if (errors.email) setErrors((prev) => ({ ...prev, email: undefined })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <TextField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(v) => { setPassword(v); if (errors.password) setErrors((prev) => ({ ...prev, password: undefined })); }}
                secureTextEntry={!showPassword}
                error={errors.password}
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

              {errors.form ? (
                <ThemedText style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>
                  {errors.form}
                </ThemedText>
              ) : null}

              <PrimaryButton
                title="Sign In"
                onPress={handleLogin}
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
