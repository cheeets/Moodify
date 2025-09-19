import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoals(list);
        setLoading(false);
      },
      (err) => {
        console.error("Snapshot error:", err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // DELETE FUNCTION
  const handleDelete = (id) => {
    Alert.alert(
      "Delete mood",
      "Are you sure you want to delete this Mood log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const docRef = doc(db, "goals", id);
              await deleteDoc(docRef);
            } catch (error) {
              console.error("Error deleting Mood:", error.message);
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/"); // navigate to login/home
    } catch (error) {
      console.error("Logout error:", error.message);
      Alert.alert("Logout failed", error.message);
    }
  };

  // Map mood text to emoji
  const getMoodEmoji = (mood) => {
    if (!mood) return "❓";
    const lower = mood.toLowerCase();
    if (lower.includes("sad")) return "😢";
    if (lower.includes("angry")) return "😡";
    if (lower.includes("tired")) return "🥱";
    if (lower.includes("ok") || lower.includes("neutral")) return "😐";
    if (lower.includes("happy")) return "🙂";
    if (lower.includes("excited") || lower.includes("great")) return "😁";
    return "🙂"; // default
  };

  const renderItem = ({ item }) => (
    <View style={styles.goalItem}>
      <View style={styles.leftRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{getMoodEmoji(item.title)}</Text>
        </View>

        <View style={styles.textCol}>
          <Text style={styles.goalTitle}>{item.title || "Untitled Mood"}</Text>
          <Text style={styles.metaText}>
            {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : ""}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: "#F3F4FF" }]}
          onPress={() => router.push(`/goals/edit/${item.id}`)}
        >
          <Ionicons name="pencil" size={18} color="#6C5CE7" />
        </Pressable>

        <Pressable
          style={[styles.iconBtn, { backgroundColor: "#FFF2F2" }]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={18} color="#EF4444" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Mood Logs</Text>

        <View style={styles.headerActions}>
          <Pressable style={styles.headerBtn} onPress={() => router.push("/goals/create")}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.headerBtnText}>Add</Text>
          </Pressable>

          <Pressable style={[styles.headerBtn, styles.logoutBtn]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.headerBtnText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6C5CE7" />
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={goals.length === 0 && styles.emptyContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Heyyy — tell me your mood. Add one!</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
    paddingTop: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 8,
  },
  logoutBtn: {
    backgroundColor: "#FF8A00",
  },
  headerBtnText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  goalItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#F3F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  textCol: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  metaText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#9CA3AF",
    fontSize: 16,
  },
});
