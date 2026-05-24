import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useGroupStore } from "./store/groupStore";

export default function Index() {
  const router = useRouter();
  const groups = useGroupStore((state) => state.groups);
  const loadGroups = useGroupStore((state) => state.loadGroups);

  useEffect(() => {
    loadGroups();
  }, []);

  const totalExpenses = groups.reduce(
    (total, group) => total + group.expenses.length,
    0
  );

  const getGroupEmoji = (index: number) => {
    const emojis = ["🧳", "🏠", "🍜", "☕️", "🎀", "💌"];
    return emojis[index % emojis.length];
  };

  const getCatEmoji = (index: number) => {
    const cats = ["😺", "😽", "🐱", "😸"];
    return cats[index % cats.length];
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Tabby</Text>
          <Text style={styles.subtitle}>Your cozy shared expense tracker.</Text>
        </View>

        <View style={styles.catBubble}>
          <Text style={styles.catFace}>🐱</Text>
        </View>
      </View>

      <View style={styles.dashboardCard}>
        <View style={styles.cardTopRow}>
          <View>
            <Text style={styles.dashboardTitle}>Money moments 🐾</Text>
            <Text style={styles.dashboardSubtitle}>
              Track trips, roommates, dinners, and shared plans.
            </Text>
          </View>

          <Text style={styles.jarEmoji}>🫙</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.pinkStatCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statNumber}>{groups.length}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>

          <View style={styles.greenStatCard}>
            <Text style={styles.statIcon}>🧾</Text>
            <Text style={styles.statNumber}>{totalExpenses}</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/create-group")}
      >
        <Text style={styles.buttonText}>＋ Create Group 🐾</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Your Groups ✨</Text>

      {groups.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyCat}>🐱</Text>
          <View>
            <Text style={styles.emptyTitle}>No groups yet</Text>
            <Text style={styles.emptyText}>
              Start with a trip, dinner, or roommate budget.
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.groupCard}
              onPress={() => router.push(`/group/${item.id}`)}
            >
              <View style={styles.groupIconBox}>
                <Text style={styles.groupIcon}>{getGroupEmoji(index)}</Text>
              </View>

              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>
                  {item.name} {getCatEmoji(index)}
                </Text>
                <Text style={styles.memberText}>
                  {item.members.length} member
                  {item.members.length === 1 ? "" : "s"} ·{" "}
                  {item.expenses.length} expense
                  {item.expenses.length === 1 ? "" : "s"}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFF7EF",
  },
  headerRow: {
    marginTop: 54,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 54,
    fontWeight: "900",
    color: "#FF7F8F",
    letterSpacing: 1,
    textShadowColor: "#FFD3DA",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#725947",
    marginTop: 4,
    fontWeight: "600",
  },
  catBubble: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#FFF1D8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD6C8",
  },
  catFace: {
    fontSize: 42,
  },
  dashboardCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#5B3F2E",
  },
  dashboardSubtitle: {
    fontSize: 15,
    color: "#7B6F66",
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 220,
    fontWeight: "600",
  },
  jarEmoji: {
    fontSize: 52,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  pinkStatCard: {
    flex: 1,
    backgroundColor: "#FFE6E8",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFC8D0",
  },
  greenStatCard: {
    flex: 1,
    backgroundColor: "#EAF8DF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#CFEBC1",
  },
  statIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 34,
    fontWeight: "900",
    color: "#5B3F2E",
  },
  statLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#725947",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#FF7F8F",
    padding: 18,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FFB3BE",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#5B3F2E",
    marginBottom: 12,
  },
  list: {
    gap: 12,
    paddingBottom: 90,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#F6DCCD",
    flexDirection: "row",
    alignItems: "center",
  },
  groupIconBox: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#FFE6E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  groupIcon: {
    fontSize: 30,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#5B3F2E",
  },
  memberText: {
    marginTop: 5,
    fontSize: 14,
    color: "#7B6F66",
    fontWeight: "600",
  },
  arrow: {
    fontSize: 36,
    color: "#B99C88",
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#FFFDF9",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#FFB3BE",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  emptyCat: {
    fontSize: 50,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#5B3F2E",
  },
  emptyText: {
    color: "#7B6F66",
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    fontWeight: "600",
    maxWidth: 230,
  },
});