import { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useStore } from "@livestore/react";
// import { noteReactionCountsByEmoji$ } from "@workshop/shared/queries";
import { noteReactionsStyles } from "@workshop/shared/styles/note-reactions";
import { Ionicons } from "@expo/vector-icons";
import { events } from "@workshop/shared/schema";
import { nanoid } from "@livestore/livestore";
import { AuthContext } from "../context/auth";
import * as Haptics from "expo-haptics";
import { noteReactionCountsByEmoji$ } from "@workshop/shared/queries";

const reactionColors = ["#FF7E7E", "#7EB3FF", "#8FD28F", "#FFE07E", "#D7A0FF"];

export const NoteReactions = ({ noteId }: { noteId: string }) => {
  const { store } = useStore();
  const { user } = use(AuthContext);
  const router = useRouter();

  const reactionCounts = useQuery(noteReactionCountsByEmoji$(noteId));

  return (
    <View style={{ width: "100%", marginTop: 8 }}>
      <View
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: "lightgray",
          marginVertical: 12,
        }}
      />
      <View style={noteReactionsStyles.container as ViewStyle}>
        <Pressable
          style={noteReactionsStyles.reactionButton as ViewStyle}
          onPress={() =>
            router.push({
              pathname: "/reaction/[note]",
              params: { note: noteId },
            })
          }
        >
          <Ionicons name="happy-outline" size={24} color="gray" />
        </Pressable>

        {reactionCounts.map(({ emoji, count }) => (
          <View
            key={emoji}
            style={noteReactionsStyles.reactionButton as ViewStyle}
          >
            <Text style={noteReactionsStyles.emojiText as TextStyle}>
              {emoji}
            </Text>
            {count > 0 && (
              <Text
                style={[
                  noteReactionsStyles.countText as TextStyle,
                  { right: -10, top: -5 },
                ]}
              >
                {count}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
