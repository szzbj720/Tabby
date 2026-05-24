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
import { useGroupStore } from "../../store/groupStore";

export default function EditExpense() {
  const { groupId, expenseId } = useLocalSearchParams();
  const router = useRouter();

  const group = useGroupStore((state) =>
    state.groups.find((g) => g.id === groupId)
  );
  const editExpense = useGroupStore((state) => state.editExpense);

  const expense = group?.expenses.find((item) => item.id === expenseId);

  const [title, setTitle] = useState(expense?.title ?? "");
  const [amount, setAmount] = useState(
    expense ? expense.amount.toString() : ""
  );
  const [paidBy, setPaidBy] = useState(expense?.paidBy ?? "");
  const [splitBetween, setSplitBetween] = useState<string[]>(
    expense?.splitBetween ?? []
  );
  const [coveredMembers, setCoveredMembers] = useState<string[]>(
    expense?.coveredMembers ?? []
  );
  const [isCoveredByPayer, setIsCoveredByPayer] = useState(
    expense?.isCoveredByPayer ?? false
  );

  if (!group || !expense) {
    return (
      <View style={styles.fallback}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  const toggleSplitMember = (member: string) => {
    if (splitBetween.includes(member)) {
      setSplitBetween(splitBetween.filter((name) => name !== member));
      setCoveredMembers(coveredMembers.filter((name) => name !== member));
    } else {
      setSplitBetween([...splitBetween, member]);
    }
  };

  const toggleCoveredMember = (member: string) => {
    if (!splitBetween.includes(member)) return;

    if (coveredMembers.includes(member)) {
      setCoveredMembers(coveredMembers.filter((name) => name !== member));
    } else {
      setCoveredMembers([...coveredMembers, member]);
    }
  };

  const handleSave = () => {
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

    editExpense(group.id, expense.id, {
      id: expense.id,
      title: title.trim(),
      amount: amountNumber,
      paidBy,
      splitBetween: isCoveredByPayer ? [] : splitBetween,
      coveredMembers: isCoveredByPayer ? [] : coveredMembers,
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
        <Text style={styles.title}>Edit Expense</Text>
        <Text style={styles.subtitle}>Update this shared cost.</Text>
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

            <Text style={styles.label}>Covered members 🎁</Text>
            <View style={styles.memberContainer}>
              {group.members.map((member) => {
                const isDisabled = !splitBetween.includes(member);
                const isSelected = coveredMembers.includes(member);

                return (
                  <Pressable
                    key={member}
                    style={[
                      styles.memberButton,
                      isDisabled && styles.memberButtonDisabled,
                      isSelected && styles.memberButtonSelected,
                    ]}
                    onPress={() => toggleCoveredMember(member)}
                  >
                    <Text
                      style={[
                        styles.memberText,
                        isDisabled && styles.memberTextDisabled,
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

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes 🐾</Text>
      </Pressable>

      <Text style={styles.helperText}>
        Covered members are included in the expense but do not pay their share.
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
  memberButtonDisabled: {
    opacity: 0.35,
  },
  memberText: {
    color: "#5B3F2E",
    fontWeight: "900",
    fontSize: 15,
  },
  memberTextSelected: {
    color: "#FFFFFF",
  },
  memberTextDisabled: {
    color: "#AFA19A",
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