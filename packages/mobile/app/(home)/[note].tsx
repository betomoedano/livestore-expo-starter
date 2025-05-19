import React, { useRef, useEffect } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useStore } from "@livestore/react";
import { events, tables } from "@workshop/shared/schema";
import { queryDb } from "@livestore/livestore";

export default function Note() {
  const { store } = useStore();
  const { note: noteId } = useLocalSearchParams() as { note: string };

  const note = store.useQuery(
    queryDb(tables.note.where({ id: noteId }).first(), { label: "noteById" })
  );

  const handleEditTitle = (title: string) => {
    store.commit(events.noteTitleUpdated({ id: noteId, title }));
  };

  const handleEditContent = (content: string) => {
    store.commit(events.noteContentUpdated({ id: noteId, content }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: note.title || "Untitled",
        }}
      />
      <View style={styles.container}>
        <View style={styles.noteCard}>
          <TextInput
            autoFocus
            autoCorrect={false}
            style={styles.title}
            value={note.title ?? ""}
            onChangeText={handleEditTitle}
            placeholder="Note title"
          />
          <TextInput
            style={styles.content}
            value={note.content ?? ""}
            onChangeText={handleEditContent}
            multiline
            textAlignVertical="top"
            placeholder="Write your note here..."
            maxLength={500}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2F2F7",
  },
  noteCard: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 20,
  },
});
