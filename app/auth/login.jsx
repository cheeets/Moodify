// app/screens/Login.jsx
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
// Optional: if using expo-managed workflow, you can install expo-linear-gradient
// and uncomment the import & wrapper below for a nicer background:
// import { LinearGradient } from "expo-linear-gradient";
// Optional icons: npm i @expo/vector-icons
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const THEME = {
    top: "#8E7BFF",
    bottom: "#6C5CE7",
    accent: "#00B894",
    card: "#ffffff",
    text: "#0F172A",
    muted: "#6B7280",
  };

  const friendlyMessage = (code, message) => {
    // Map common Firebase errors to friendlier text
    if (!code && message) return message;
    if (code?.includes("auth/invalid-email")) return "Invalid email address.";
    if (code?.includes("auth/user-not-found")) return "No account found with that email.";
    if (code?.includes("auth/wrong-password")) return "Incorrect password.";
    if (code?.includes("auth/network-request-failed")) return "Network error — check your connection.";
    return "Failed to sign in. Please check credentials.";
  };

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setLoading(false);
      router.replace("/");
    } catch (err) {
      setLoading(false);
      setError(friendlyMessage(err.code, err.message));
    }
  };

  return (
    // If you installed expo-linear-gradient, replace outer View with:
    // <LinearGradient colors={[THEME.top, THEME.bottom]} style={styles.screen}>
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.card}>
          <View style={styles.logoRow}>
            <Text style={styles.logoEmoji}>😊</Text>
            <View>
              <Text style={styles.title}>Moodify</Text>
              <Text style={styles.subtitle}>Track your mood — simply</Text>
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
                placeholder="••••••••"
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
                <Ionicons name={secure ? "eye-off" : "eye"} size={20} color="#6C5CE7" />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.8 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.row}>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text style={styles.link}>Create account</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/auth/forgot")}>
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.orRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => alert("Add Google/Facebook auth integration")}
            >
              <Ionicons name="logo-google" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>Made with ❤️ for better mood tracking</Text>
      </KeyboardAvoidingView>
    </View>
    // If using LinearGradient close here: </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // gradient fallback color
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
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
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
    justifyContent: "space-between",
    marginTop: 12,
  },
  link: {
    color: "#6C5CE7",
    fontWeight: "700",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6EEF8",
  },
  orText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6EEF8",
    marginTop: 12,
  },
  secondaryBtnText: {
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    alignSelf: "center",
    marginTop: 18,
    color: "#fff",
    opacity: 0.95,
  },
});
