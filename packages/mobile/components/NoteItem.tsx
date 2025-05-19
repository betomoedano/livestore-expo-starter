import { useStore } from "@livestore/react";
import * as React from "react";
import { Text, View, TextStyle, Pressable } from "react-native";
import { noteItemStyles } from "@workshop/shared/styles/note-item";

import type { Note as INote } from "@workshop/shared/schema";
import { events } from "@workshop/shared/schema";
import { Link, router } from "expo-router";
import { NoteReactions } from "./NoteReactions";

export const Note: React.FC<INote> = ({
  id,
  title,
  content,
  createdBy,
  createdAt,
}) => {
  const { store } = useStore();

  const handleDeleteNote = () =>
    store.commit(events.noteDeleted({ id, deletedAt: new Date() }));

  return (
    <Link
      href={{
        pathname: "/[note]",
        params: {
          note: id,
        },
      }}
      onLongPress={() => {
        router.push({
          pathname: "/reaction/[note]",
          params: {
            note: id,
          },
        });
      }}
      style={noteItemStyles.container}
    >
      <View style={{ width: "100%" }}>
        <Text
          selectable
          style={noteItemStyles.title as TextStyle}
          numberOfLines={1}
        >
          {title || "Untitled"}
        </Text>
        <Text style={noteItemStyles.content} numberOfLines={3}>
          {content || "No content"}
        </Text>
        <Text style={[noteItemStyles.content, { marginTop: 4 }]}>
          {`Created by ${createdBy || "Unknown"} - ${new Date(createdAt).toLocaleDateString()} ${new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        </Text>

        <Pressable onPress={handleDeleteNote}>
          <Text>Delete</Text>
        </Pressable>
        <NoteReactions noteId={id} />
      </View>
    </Link>
  );
};
