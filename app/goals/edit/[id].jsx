// app/screens/EditGoal.jsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const moodOptions = [
  { label: "😊", value: "happy" },
  { label: "😞", value: "sad" },
  { label: "🤒", value: "not_well" },
];

export default function EditGoal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(""); // New mood state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const THEME = {
    bgTop: "#8E7BFF",
    bgBottom: "#6C5CE7",
    brand: "#6C5CE7",
    accent: "#21cc8d",
    card: "#ffffff",
    muted: "#6B7280",
  };

  // Fetch goal data
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title ?? "");
          setMood(data.mood ?? "");
        } else {
          // if doc doesn't exist you could route back
          router.replace("/goals");
        }
      } catch (error) {
        console.log("Error fetching goal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const handleUpdate = async () => {
    if (!mood) return; // prevent submission without mood
    try {
      setSaving(true);
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        title,
        mood, // Save the selected mood string
      });
      Keyboard.dismiss();
      setSaving(false);
      router.push("/goals");
    } catch (error) {
      console.log("Error updating goal:", error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={THEME.brand} />
      </View>
    );
  }

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
            <View style={{ flex: 1 }}>
              <Text style={styles.heading}>Edit Mood</Text>
              <Text style={styles.sub}>How are you feeling today?</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title (optional)"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Select your mood</Text>

            <View style={styles.moodContainer}>
              {moodOptions.map((item) => {
                const selected = mood === item.value;
                return (
                  <Pressable
                    key={item.value}
                    style={[
                      styles.moodButton,
                      selected && { borderColor: THEME.brand, borderWidth: 2, backgroundColor: "#FFF" },
                    ]}
                    onPress={() => setMood(item.value)}
                  >
                    <Text style={styles.moodEmoji}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={handleUpdate}
              style={[
                styles.submitButton,
                saving && { opacity: 0.8 },
                !mood && { opacity: 0.6 },
              ]}
              disabled={!mood || saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Update Mood</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#6C5CE7", // theme background
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
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  logoEmoji: { fontSize: 36, marginRight: 12 },
  heading: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  sub: { color: "#6B7280", fontSize: 12 },
  content: { marginTop: 6 },
  label: { color: "#374151", marginBottom: 6, fontWeight: "600" },
  input: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6EEF8",
    fontSize: 16,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  moodButton: {
    padding: 14,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  moodEmoji: { fontSize: 28 },
  submitButton: {
    marginTop: 18,
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  center: { justifyContent: "center", alignItems: "center" },
});
