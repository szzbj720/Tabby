import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGroupStore } from "../store/groupStore";

export default function GroupDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const group = useGroupStore((state) =>
    state.groups.find((g) => g.id === id)
  );

  const deleteExpense = useGroupStore((state) => state.deleteExpense);
  const settleGroup = useGroupStore((state) => state.settleGroup);

  if (!group) {
    return (
      <View style={styles.fallback}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const confirmDeleteExpense = (expenseId: string) => {
    const message =
      "This will permanently remove this expense from the group.";

    if (Platform.OS === "web") {
      const confirmed = window.confirm(`Delete expense?\n\n${message}`);

      if (confirmed) {
        deleteExpense(group.id, expenseId);
      }

      return;
    }

    Alert.alert("Delete expense?", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteExpense(group.id, expenseId),
      },
    ]);
  };

  const confirmSettleUp = () => {
    const message =
      "This will clear all expenses and reset the group balances.";

    if (Platform.OS === "web") {
      const confirmed = window.confirm(`Settle up?\n\n${message}`);

      if (confirmed) {
        settleGroup(group.id);
      }

      return;
    }

    Alert.alert("Settle up?", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Settle Up",
        style: "destructive",
        onPress: () => settleGroup(group.id),
      },
    ]);
  };

  const totalSpentCents = group.expenses.reduce(
  (total, expense) => total + Math.round(expense.amount * 100),
  0
);

// All balances are stored as integer cents.
const balances: Record<string, number> = {};

group.members.forEach((member) => {
  balances[member] = 0;
});

group.expenses.forEach((expense) => {
  if (expense.isCoveredByPayer || expense.splitBetween.length === 0) {
    return;
  }

  const coveredMembers = expense.coveredMembers ?? [];

  // Remove duplicates while making sure the payer is included.
  const allParticipants = Array.from(
    new Set(
      expense.splitBetween.includes(expense.paidBy)
        ? expense.splitBetween
        : [...expense.splitBetween, expense.paidBy]
    )
  );

  const totalCents = Math.round(expense.amount * 100);
  const baseShareCents = Math.floor(
    totalCents / allParticipants.length
  );

  let remainingCents = totalCents % allParticipants.length;

  const shares: Record<string, number> = {};

  // Distribute leftover cents deterministically.
  allParticipants.forEach((person) => {
    shares[person] =
      baseShareCents + (remainingCents > 0 ? 1 : 0);

    if (remainingCents > 0) {
      remainingCents--;
    }
  });

  allParticipants.forEach((person) => {
    // The payer does not repay themselves.
    if (person === expense.paidBy) {
      return;
    }

    // The payer is covering this member's portion.
    if (coveredMembers.includes(person)) {
      return;
    }

    const shareCents = shares[person] ?? 0;

    balances[person] -= shareCents;
    balances[expense.paidBy] += shareCents;
  });
});

const debtors = Object.entries(balances)
  .filter(([, balanceCents]) => balanceCents < 0)
  .map(([name, balanceCents]) => ({
    name,
    amountCents: Math.abs(balanceCents),
  }));

const creditors = Object.entries(balances)
  .filter(([, balanceCents]) => balanceCents > 0)
  .map(([name, balanceCents]) => ({
    name,
    amountCents: balanceCents,
  }));

const settlements: {
  from: string;
  to: string;
  amountCents: number;
}[] = [];

let debtorIndex = 0;
let creditorIndex = 0;

while (
  debtorIndex < debtors.length &&
  creditorIndex < creditors.length
) {
  const debtor = debtors[debtorIndex];
  const creditor = creditors[creditorIndex];

  const paymentCents = Math.min(
    debtor.amountCents,
    creditor.amountCents
  );

  settlements.push({
    from: debtor.name,
    to: creditor.name,
    amountCents: paymentCents,
  });

  debtor.amountCents -= paymentCents;
  creditor.amountCents -= paymentCents;

  if (debtor.amountCents === 0) {
    debtorIndex++;
  }

  if (creditor.amountCents === 0) {
    creditorIndex++;
  }
}

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerCard}>
        <Text style={styles.cat}>🐱</Text>
        <Text style={styles.title}>{group.name}</Text>
        <Text style={styles.subtitle}>
          Shared spending, settled softly.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryPillPink}>
            <Text style={styles.summaryNumber}>
              {group.members.length}
            </Text>
            <Text style={styles.summaryLabel}>Members</Text>
          </View>

          <View style={styles.summaryPillGreen}>
            <Text style={styles.summaryNumber}>
              ${totalSpent.toFixed(2)}
            </Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push(`/add-expense/${group.id}`)}
      >
        <Text style={styles.primaryButtonText}>
          ＋ Add Expense 🐾
        </Text>
      </Pressable>

      <Pressable
        style={styles.editGroupButton}
        onPress={() => router.push(`/edit-group/${group.id}`)}
      >
        <Text style={styles.editGroupButtonText}>
          ✏️ Edit Group
        </Text>
      </Pressable>

      {group.expenses.length > 0 && (
        <Pressable
          style={styles.secondaryButton}
          onPress={confirmSettleUp}
        >
          <Text style={styles.secondaryButtonText}>
            Settle Up
          </Text>
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>Expenses 🧾</Text>

      {group.expenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No expenses yet</Text>
          <Text style={styles.emptyText}>
            Add your first shared cost.
          </Text>
        </View>
      ) : (
        group.expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>
                {expense.title}
              </Text>

              <Text style={styles.expenseText}>
                Paid by {expense.paidBy}
              </Text>

              {expense.isCoveredByPayer ? (
                <Text style={styles.coveredText}>
                  Covered by payer
                </Text>
              ) : (
                <>
                  <Text style={styles.expenseText}>
                    Split with {expense.splitBetween.join(", ")}
                  </Text>

                  {(expense.coveredMembers ?? []).length > 0 && (
                    <Text style={styles.coveredText}>
                      Covered:{" "}
                      {(expense.coveredMembers ?? []).join(", ")}
                    </Text>
                  )}
                </>
              )}
            </View>

            <View style={styles.rightSide}>
              <Text style={styles.expenseAmount}>
                ${expense.amount.toFixed(2)}
              </Text>

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.iconButton}
                  onPress={() =>
                    router.push(
                      `/edit-expense/${group.id}/${expense.id}`
                    )
                  }
                >
                  <Text style={styles.iconText}>✏️</Text>
                </Pressable>

                <Pressable
                  style={styles.iconButton}
                  onPress={() =>
                    confirmDeleteExpense(expense.id)
                  }
                >
                  <Text style={styles.iconText}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Balances 💗</Text>

      <View style={styles.balanceCard}>
        {group.members.map((member) => {
          const balance = balances[member];

          return (
            <View key={member} style={styles.balanceRow}>
              <Text style={styles.balanceName}>
                {member}
              </Text>

              <Text
                style={[
                  styles.balanceValue,
                  balance > 0.01 && styles.positive,
                  balance < -0.01 && styles.negative,
                ]}
              >
                {balance >= 0
                  ? `gets $${balance.toFixed(2)}`
                  : `owes $${Math.abs(balance).toFixed(2)}`}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>
        Suggested Payments 💸
      </Text>

      {settlements.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            Everyone is settled up
          </Text>
          <Text style={styles.emptyText}>
            No payments needed right now.
          </Text>
        </View>
      ) : (
        settlements.map((settlement, index) => (
          <View key={index} style={styles.settlementCard}>
            <Text style={styles.settlementText}>
              {settlement.from} pays {settlement.to}
            </Text>

            <Text style={styles.settlementAmount}>
              ${settlement.amount.toFixed(2)}
            </Text>
          </View>
        ))
      )}
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
    paddingBottom: 100,
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

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  summaryPillPink: {
    flex: 1,
    backgroundColor: "#FFE6E8",
    borderRadius: 22,
    padding: 16,
  },

  summaryPillGreen: {
    flex: 1,
    backgroundColor: "#EAF8DF",
    borderRadius: 22,
    padding: 16,
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#5B3F2E",
  },

  summaryLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#725947",
    marginTop: 4,
  },

  primaryButton: {
    backgroundColor: "#FF7F8F",
    padding: 18,
    borderRadius: 24,
    marginTop: 18,
    borderWidth: 2,
    borderColor: "#FFB3BE",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  editGroupButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F6DCCD",
    marginTop: 12,
  },

  editGroupButtonText: {
    color: "#5B3F2E",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },

  secondaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#FFB3BE",
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#FF7F8F",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#5B3F2E",
    marginTop: 26,
    marginBottom: 12,
  },

  emptyCard: {
    backgroundColor: "#FFFDF9",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#FFB3BE",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#5B3F2E",
  },

  emptyText: {
    fontSize: 14,
    color: "#7B6F66",
    marginTop: 5,
    fontWeight: "600",
  },

  expenseCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 26,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F6DCCD",
    flexDirection: "row",
    gap: 12,
  },

  expenseInfo: {
    flex: 1,
  },

  expenseTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#5B3F2E",
  },

  expenseText: {
    fontSize: 13,
    color: "#7B6F66",
    marginTop: 3,
    fontWeight: "600",
  },

  coveredText: {
    fontSize: 13,
    color: "#FF7F8F",
    marginTop: 3,
    fontWeight: "900",
  },

  rightSide: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  expenseAmount: {
    fontSize: 19,
    fontWeight: "900",
    color: "#FF7F8F",
  },

  actionRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },

  iconButton: {
    backgroundColor: "#FFF7EF",
    padding: 8,
    borderRadius: 16,
  },

  iconText: {
    fontSize: 16,
  },

  balanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  balanceName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#5B3F2E",
  },

  balanceValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#7B6F66",
  },

  positive: {
    color: "#2E7D32",
  },

  negative: {
    color: "#C62828",
  },

  settlementCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 26,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F6DCCD",
  },

  settlementText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#5B3F2E",
  },

  settlementAmount: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FF7F8F",
    marginTop: 4,
  },
});
