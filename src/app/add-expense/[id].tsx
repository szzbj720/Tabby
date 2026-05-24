import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useGroupStore } from "../store/groupStore";

export default function AddExpense() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const group = useGroupStore((state) =>
    state.groups.find((g) => g.id === id)
  );

  const addExpense = useGroupStore((state) => state.addExpense);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [isCoveredByPayer, setIsCoveredByPayer] = useState(false);

  if (!group) {
    return (
      <View style={styles.fallback}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const toggleSplitMember = (member: string) => {
    if (splitBetween.includes(member)) {
      setSplitBetween(splitBetween.filter((name) => name !== member));
    } else {
      setSplitBetween([...splitBetween, member]);
    }
  };

  const handleAdd = () => {
    const amountNumber = parseFloat(amount);

    if (
      !title.trim() ||
      !amount.trim() ||
      Number.isNaN(amountNumber) ||
      amountNumber <= 0 ||
      !paidBy ||
      (!isCoveredByPayer && splitBetween.length === 0)
    ) {
      return;
    }

    addExpense(group.id, {
      id: Date.now().toString(),
      title: title.trim(),
      amount: amountNumber,
      paidBy,
      splitBetween: isCoveredByPayer ? [] : splitBetween,
      isCoveredByPayer,
    });

    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerCard}>
        <Text style={styles.cat}>🐱</Text>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>Log a shared cost for {group.name}.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Expense title</Text>
        <TextInput
          placeholder="Cake, dinner, coffee..."
          placeholderTextColor="#C7B8AE"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor="#C7B8AE"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Paid by 💳</Text>
        <View style={styles.memberContainer}>
          {group.members.map((member) => (
            <Pressable
              key={member}
              style={[
                styles.memberButton,
                paidBy === member && styles.memberButtonSelected,
              ]}
              onPress={() => setPaidBy(member)}
            >
              <Text
                style={[
                  styles.memberText,
                  paidBy === member && styles.memberTextSelected,
                ]}
              >
                {member}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Payment type</Text>
        <View style={styles.memberContainer}>
          <Pressable
            style={[
              styles.modeButton,
              !isCoveredByPayer && styles.memberButtonSelected,
            ]}
            onPress={() => setIsCoveredByPayer(false)}
          >
            <Text
              style={[
                styles.memberText,
                !isCoveredByPayer && styles.memberTextSelected,
              ]}
            >
              Split it
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.modeButton,
              isCoveredByPayer && styles.memberButtonSelected,
            ]}
            onPress={() => setIsCoveredByPayer(true)}
          >
            <Text
              style={[
                styles.memberText,
                isCoveredByPayer && styles.memberTextSelected,
              ]}
            >
              Covered by payer
            </Text>
          </Pressable>
        </View>

        {!isCoveredByPayer && (
          <>
            <Text style={styles.label}>Split between 🧾</Text>
            <View style={styles.memberContainer}>
              {group.members.map((member) => {
                const isSelected = splitBetween.includes(member);

                return (
                  <Pressable
                    key={member}
                    style={[
                      styles.memberButton,
                      isSelected && styles.memberButtonSelected,
                    ]}
                    onPress={() => toggleSplitMember(member)}
                  >
                    <Text
                      style={[
                        styles.memberText,
                        isSelected && styles.memberTextSelected,
                      ]}
                    >
                      {member}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </View>

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>＋ Add Expense 🐾</Text>
      </Pressable>

      <Text style={styles.helperText}>
        Use “Covered by payer” when someone paid for everything and does not
        expect anyone to pay them back.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFF7EF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF7EF",
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 90,
  },
  headerCard: {
    marginTop: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },
  cat: {
    fontSize: 42,
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#5B3F2E",
  },
  subtitle: {
    fontSize: 15,
    color: "#7B6F66",
    marginTop: 6,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },
  label: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 8,
    color: "#5B3F2E",
  },
  input: {
    backgroundColor: "#FFF7EF",
    padding: 16,
    borderRadius: 22,
    marginBottom: 8,
    fontSize: 16,
    color: "#5B3F2E",
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },
  memberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  memberButton: {
    backgroundColor: "#FFF7EF",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },
  modeButton: {
    backgroundColor: "#FFF7EF",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },
  memberButtonSelected: {
    backgroundColor: "#FF7F8F",
    borderColor: "#FFB3BE",
  },
  memberText: {
    color: "#5B3F2E",
    fontWeight: "900",
    fontSize: 15,
  },
  memberTextSelected: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FF7F8F",
    padding: 18,
    borderRadius: 24,
    marginTop: 18,
    borderWidth: 2,
    borderColor: "#FFB3BE",
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 18,
  },
  helperText: {
    marginTop: 12,
    color: "#7B6F66",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "600",
  },
});