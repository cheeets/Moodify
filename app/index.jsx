import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Link, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const [greeting, setGreeting] = useState("");
  const [mood, setMood] = useState(""); // simple mood tracker
  const [selectedMoodIcon, setSelectedMoodIcon] = useState("");

  // Motivational quotes / self-care tips
  const quotes = [
    "Take a deep breath — you're doing better than you think. 🌱",
    "Small steps every day lead to big changes. 🚶‍♂️",
    "Your feelings are valid. 💚",
    "Be kind to yourself today. 🌸",
    "Happiness is found in little moments. ✨",
    "Resting is also progress. 😴",
  ];

  // Simple reminders
  const reminders = [
    "Don’t forget to drink water 💧",
    "Stretch for a minute ⏱️",
    "Smile, even at yourself in the mirror 🙂",
    "Check in with your breathing 🌬️",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);

        // Greeting by time
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning 🌞");
        else if (hour < 18) setGreeting("Good afternoon 🌻");
        else setGreeting("Good evening 🌙");

        // Pick a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  const moodOptions = [
    { label: "Happy", emoji: "😊" },
    { label: "Sad", emoji: "😔" },
    { label: "Angry", emoji: "😡" },
    { label: "Tired", emoji: "😴" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.appTitle}>Moodify</Text>

        {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}

        <View style={styles.quickActions}>
          <Link href="/goals" style={styles.actionButton}>
            <Text style={styles.actionText}>Mood Logs</Text>
          </Link>

          <Link href="/goals/create" style={styles.actionButtonSecondary}>
            <Text style={styles.actionTextSecondary}>Tell your Mood</Text>
          </Link>
        </View>

        {/* Mood of the Day */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How are you feeling today?</Text>

          <View style={styles.moodsRow}>
            {moodOptions.map((m) => {
              const selected = selectedMoodIcon === m.emoji;
              return (
                <Pressable
                  key={m.label}
                  style={[styles.moodBtn, selected && styles.moodBtnSelected]}
                  onPress={() => {
                    setSelectedMoodIcon(m.emoji);
                    setMood(`${m.emoji} ${m.label}`);
                  }}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={styles.moodLabel}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {mood ? <Text style={styles.selectedText}>Today you feel: {mood}</Text> : null}
        </View>

        {/* Quote */}
        {quote ? (
          <View style={styles.card}>
            <Text style={styles.cardTitleSmall}>Quote for you</Text>
            <Text style={styles.quoteText}>{quote}</Text>
          </View>
        ) : null}

        {/* Reminder */}
        <View style={styles.reminderBox}>
          <Text style={styles.reminderText}>
            {reminders[Math.floor(Math.random() * reminders.length)]}
          </Text>
        </View>

        {/* Footer / Quick links */}
        <View style={styles.footerRow}>
          <Pressable style={styles.smallBtn} onPress={() => router.push("/goals")}>
            <Text style={styles.smallBtnText}>View Logs</Text>
          </Pressable>

          <Pressable style={[styles.smallBtn, styles.logoutBtn]} onPress={() => router.push("/auth/login")}>
            <Text style={styles.smallBtnText}>Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9F9FB" },
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  center: { justifyContent: "center", alignItems: "center" },
  appTitle: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 6,
  },
  greeting: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 18,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  actionButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionText: { color: "#fff", fontWeight: "700" },
  actionButtonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6C5CE7",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionTextSecondary: {
    color: "#6C5CE7",
    fontWeight: "700",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    color: "#0F172A",
  },
  cardTitleSmall: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  moodsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    width: 72,
    marginRight: 6,
  },
  moodBtnSelected: {
    backgroundColor: "#F0EDFF",
    borderWidth: 2,
    borderColor: "#6C5CE7",
  },
  moodEmoji: { fontSize: 26 },
  moodLabel: { marginTop: 6, fontSize: 12, color: "#374151", fontWeight: "700" },
  selectedText: { marginTop: 10, color: "#374151", fontWeight: "600" },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#374151",
    textAlign: "center",
  },
  reminderBox: {
    marginTop: 6,
    backgroundColor: "#FFF8ED",
    borderRadius: 10,
    padding: 12,
    width: "100%",
  },
  reminderText: { color: "#7A5A00", textAlign: "center" },
  footerRow: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  smallBtn: {
    flex: 1,
    backgroundColor: "#6C5CE7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  logoutBtn: {
    backgroundColor: "#FF8A00",
  },
  smallBtnText: { color: "#fff", fontWeight: "700" },
});

export default Home;
