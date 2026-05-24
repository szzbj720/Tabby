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

export default function EditGroup() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const group = useGroupStore((state) =>
    state.groups.find((g) => g.id === id)
  );
  const editGroup = useGroupStore((state) => state.editGroup);

  const [name, setName] = useState(group?.name ?? "");
  const [members, setMembers] = useState(group?.members.join(", ") ?? "");

  if (!group) {
    return (
      <View style={styles.fallback}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    const memberList = members
      .split(",")
      .map((member) => member.trim())
      .filter((member) => member.length > 0);

    if (!name.trim() || memberList.length === 0) {
      return;
    }

    editGroup(group.id, name.trim(), memberList);
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerCard}>
        <Text style={styles.cat}>🐱</Text>
        <Text style={styles.title}>Edit Group</Text>
        <Text style={styles.subtitle}>Update your group name and members.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Group name</Text>
        <TextInput
          placeholder="NY Trip"
          placeholderTextColor="#C7B8AE"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Members</Text>
        <TextInput
          placeholder="Selena, Adam, Keke"
          placeholderTextColor="#C7B8AE"
          value={members}
          onChangeText={setMembers}
          style={[styles.input, styles.memberInput]}
          multiline
        />

        <Text style={styles.helperText}>
          Separate each member with a comma.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Group 🐾</Text>
      </Pressable>
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
  memberInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  helperText: {
    marginTop: 8,
    color: "#7B6F66",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
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
});