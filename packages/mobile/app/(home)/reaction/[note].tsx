import { use, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useStore } from "@livestore/react";
import { events, tables } from "@workshop/shared/schema";
import { nanoid, queryDb } from "@livestore/livestore";
import { useRouter } from "expo-router";
import { AuthContext } from "../../../context/auth";
import { ReactionParticles } from "../../../components/ReactionParticles";
import * as Haptics from "expo-haptics";
const reactions = ["👍", "❤️", "🔥", "🚀", "💡", "✨"];

export default function ReactionScreen() {
  const { store } = useStore();
  const router = useRouter();
  const { note: noteId } = useLocalSearchParams() as { note: string };
  const { user } = use(AuthContext);
  const [emojiPressInProgress, setEmojiPressInProgress] = useState<
    string | undefined
  >(undefined);

  const note = store.useQuery(
    queryDb(tables.note.where({ id: noteId }).first(), { label: "noteById" })
  );

  function handleReaction(
    emoji: string,
    type: "regular" | "super" = "regular"
  ) {
    Haptics.impactAsync(
      type === "regular"
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Heavy
    );
    store.commit(
      events.noteReacted({
        id: nanoid(),
        noteId: noteId,
        emoji: emoji,
        type: type,
        createdBy: user!.name,
      })
    );
    router.back();
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{note.title || "Untitled"}</Text>
        <Text style={styles.subtitle}>
          Created by {note.createdBy} on{" "}
          {new Date(note.createdAt).toDateString()}
        </Text>
      </View>

      <View style={{ gap: 6 }}>
        <View style={styles.reactionsContainer}>
          {reactions.map((reaction) => (
            <Pressable
              key={reaction}
              onPress={() => handleReaction(reaction)}
              onLongPress={() => handleReaction(reaction, "super")}
              onPressIn={() => setEmojiPressInProgress(reaction)}
              onPressOut={() => setEmojiPressInProgress(undefined)}
            >
              <ReactionItem key={reaction} reaction={reaction} />
              {emojiPressInProgress === reaction ? (
                <ReactionParticles color="orange" />
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const ReactionItem = ({ reaction }: { reaction: string }) => {
  return (
    <View style={styles.reactionItem}>
      <Text style={{ fontSize: 20 }}>{reaction}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  reactionsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 6,
  },
  reactionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "lightgray",
  },
  subtitle: {
    color: "gray",
  },
});
