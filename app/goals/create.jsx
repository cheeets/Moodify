import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";

const Create = () => {
  const [goal, setGoal] = useState("");
  const { createGoal } = useGoals();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!goal.trim()) return;

    await createGoal({
      title: goal,
      progress: 0,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setGoal("");
    Keyboard.dismiss();
    router.push("/goals");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>How are you feeling today?</Text>

        <TextInput
          style={styles.input}
          placeholder="Write your mood..."
          value={goal}
          onChangeText={setGoal}
          placeholderTextColor="#9CA3AF"
        />

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit Mood</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 25,
    elevation: 1, // subtle shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  button: {
    width: "100%",
    backgroundColor: "#6C5CE7", // Moodify violet
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
