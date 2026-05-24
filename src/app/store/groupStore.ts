import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  coveredMembers?: string[];
  isCoveredByPayer?: boolean;
};

export type Group = {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
};

type GroupStore = {
  groups: Group[];
  loadGroups: () => Promise<void>;
  addGroup: (name: string, members: string[]) => void;
  editGroup: (groupId: string, name: string, members: string[]) => void;
  addExpense: (groupId: string, expense: Expense) => void;
  editExpense: (
    groupId: string,
    expenseId: string,
    updatedExpense: Expense
  ) => void;
  deleteExpense: (groupId: string, expenseId: string) => void;
  settleGroup: (groupId: string) => void;
};

const saveGroups = async (groups: Group[]) => {
  await AsyncStorage.setItem("groups", JSON.stringify(groups));
};

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],

  loadGroups: async () => {
    const data = await AsyncStorage.getItem("groups");
    if (data) {
      set({ groups: JSON.parse(data) });
    }
  },

  addGroup: (name, members) => {
    const newGroups = [
      ...get().groups,
      {
        id: Date.now().toString(),
        name,
        members,
        expenses: [],
      },
    ];

    set({ groups: newGroups });
    saveGroups(newGroups);
  },

  editGroup: (groupId, name, members) => {
    const newGroups = get().groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            name,
            members,
            expenses: group.expenses.map((expense) => ({
              ...expense,
              paidBy: members.includes(expense.paidBy)
                ? expense.paidBy
                : members[0] ?? "",
              splitBetween: expense.splitBetween.filter((member) =>
                members.includes(member)
              ),
              coveredMembers: (expense.coveredMembers ?? []).filter((member) =>
                members.includes(member)
              ),
            })),
          }
        : group
    );

    set({ groups: newGroups });
    saveGroups(newGroups);
  },

  addExpense: (groupId, expense) => {
    const newGroups = get().groups.map((group) =>
      group.id === groupId
        ? { ...group, expenses: [...group.expenses, expense] }
        : group
    );

    set({ groups: newGroups });
    saveGroups(newGroups);
  },

  editExpense: (groupId, expenseId, updatedExpense) => {
    const newGroups = get().groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            expenses: group.expenses.map((expense) =>
              expense.id === expenseId ? updatedExpense : expense
            ),
          }
        : group
    );

    set({ groups: newGroups });
    saveGroups(newGroups);
  },

  deleteExpense: (groupId, expenseId) => {
    const newGroups = get().groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            expenses: group.expenses.filter(
              (expense) => expense.id !== expenseId
            ),
          }
        : group
    );

    set({ groups: newGroups });
    saveGroups(newGroups);
  },

  settleGroup: (groupId) => {
    const newGroups = get().groups.map((group) =>
      group.id === groupId ? { ...group, expenses: [] } : group
    );

    set({ groups: newGroups });
    saveGroups(newGroups);
  },
}));