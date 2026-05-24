import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  isCoveredByPayer?: boolean;
};

type Group = {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
};

type GroupStore = {
  groups: Group[];
  loadGroups: () => Promise<void>;
  addGroup: (name: string, members: string[]) => void;
  addExpense: (groupId: string, expense: Expense) => void;
  deleteExpense: (groupId: string, expenseId: string) => void;
  settleGroup: (groupId: string) => void;
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
    AsyncStorage.setItem("groups", JSON.stringify(newGroups));
  },

  addExpense: (groupId, expense) => {
    const newGroups = get().groups.map((group) =>
      group.id === groupId
        ? { ...group, expenses: [...group.expenses, expense] }
        : group
    );

    set({ groups: newGroups });
    AsyncStorage.setItem("groups", JSON.stringify(newGroups));
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
    AsyncStorage.setItem("groups", JSON.stringify(newGroups));
  },

  settleGroup: (groupId) => {
    const newGroups = get().groups.map((group) =>
      group.id === groupId ? { ...group, expenses: [] } : group
    );

    set({ groups: newGroups });
    AsyncStorage.setItem("groups", JSON.stringify(newGroups));
  },
}));