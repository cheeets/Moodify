// app/screens/auth/Signup.jsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const THEME = {
    top: "#8E7BFF",
    bottom: "#6C5CE7",
    brand: "#6C5CE7",
  };

  const friendlyMessage = (code, message) => {
    if (!code && message) return message;
    if (code?.includes("auth/invalid-email")) return "Invalid email address.";
    if (code?.includes("auth/email-already-in-use"))
      return "An account already exists with that email.";
    if (code?.includes("auth/weak-password"))
      return "Password is too weak. Use at least 6 characters.";
    if (code?.includes("auth/network-request-failed"))
      return "Network error — check your connection.";
    return "Failed to sign up. Please try again.";
  };

  const handleSignup = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Please fill email and password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setLoading(false);
      // After success, route back to login (you can change to router.replace('/') to go home)
      router.replace("/auth/login");
    } catch (err) {
      setLoading(false);
      setError(friendlyMessage(err.code, err.message));
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.logoEmoji}>😊</Text>
            <View>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join Moodify — track your moods easily</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[styles.label, { marginTop: 8 }]}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Choose a password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setSecure((s) => !s)}
                style={styles.eyeBtn}
              >
                <Ionicons name={secure ? "eye-off" : "eye"} size={20} color={THEME.brand} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 8 }]}>Confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={secure}
              value={confirm}
              onChangeText={setConfirm}
              autoCapitalize="none"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.85 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.muted}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <Text style={styles.link}> Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>Made with ❤️ for better mood tracking</Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#6C5CE7",
  },
  wrapper: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  back: {
    position: "absolute",
    top: 48,
    left: 18,
    padding: 8,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 12,
  },
  form: {
    marginTop: 8,
  },
  label: {
    color: "#374151",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E6EEF8",
    marginBottom: 12,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eyeBtn: {
    padding: 10,
    marginLeft: 8,
  },
  error: {
    color: "#EF4444",
    marginBottom: 8,
    textAlign: "center",
  },
  primaryBtn: {
    marginTop: 6,
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  muted: {
    color: "#6B7280",
  },
  link: {
    color: "#6C5CE7",
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    alignSelf: "center",
    marginTop: 18,
    color: "#fff",
    opacity: 0.95,
  },
});
