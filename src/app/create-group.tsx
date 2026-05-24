import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useGroupStore } from "./store/groupStore";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");

  const addGroup = useGroupStore((state) => state.addGroup);
  const router = useRouter();

  const handleCreate = () => {
    if (!name.trim()) return;

    const memberList = members
      .split(",")
      .map((member) => member.trim())
      .filter((member) => member.length > 0);

    addGroup(name.trim(), memberList);
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>

      <TextInput
        placeholder="Group name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Members, separated by commas"
        value={members}
        onChangeText={setMembers}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Group</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFF8F0",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2D2A26",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2D2A26",
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});