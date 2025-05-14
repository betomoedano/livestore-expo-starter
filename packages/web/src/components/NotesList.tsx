import { use } from "react";
import { AuthContext } from "../context/auth";
import { nanoid } from "@livestore/utils/nanoid";
import { useQuery, useStore } from "@livestore/react";
import { events } from "@workshop/shared/schema";
import { noteItemStyles } from "@workshop/shared/styles/note-item";
import {
  noteReactionCountsByEmoji$,
  visibleNotes$,
} from "@workshop/shared/queries";
import { noteReactionsStyles } from "@workshop/shared/styles/note-reactions";

export const NotesList = () => {
  const visibleNotes = useQuery(visibleNotes$);
  return (
    <ul
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {visibleNotes.length === 0 && <li>No notes</li>}
      {visibleNotes.map((note) => (
        <li
          key={note.id}
          style={{
            ...noteItemStyles.container,
            padding: "8px 12px",
            width: "400px",
          }}
        >
          <p
            style={{
              ...noteItemStyles.title,
              textTransform: "capitalize" as const,
            }}
          >
            {note.title || "Untitled"}
          </p>
          <p
            style={{
              ...noteItemStyles.content,
              lineHeight: "1.5",
            }}
          >
            {note.content || "No content"}
          </p>
          <p
            style={{
              ...noteItemStyles.content,
              lineHeight: "1.5",
            }}
          >
            {`Created by ${note.createdBy || "Unknown"} - ${new Date(note.createdAt).toLocaleDateString()} ${new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </p>
          <NoteReactions noteId={note.id} />
        </li>
      ))}
    </ul>
  );
};

function NoteReactions({ noteId }: { noteId: string }) {
  const { store } = useStore();
  const { user } = use(AuthContext);
  const reactionCounts = useQuery(noteReactionCountsByEmoji$(noteId));

  if (reactionCounts.length === 0) {
    return null;
  }

  function handleReaction(emoji: string) {
    store.commit(
      events.noteReacted({
        id: nanoid(),
        noteId: noteId,
        emoji: emoji,
        createdBy: user!.name,
      })
    );
  }

  return (
    <div>
      <div style={dividerStyle} />
      <div style={containerStyle}>
        {reactionCounts.map(({ emoji, regularCount }) => (
          <button
            key={emoji}
            style={baseButtonStyle}
            onClick={() => handleReaction(emoji)}
          >
            <span style={emojiStyle}>{emoji}</span>
            {regularCount > 0 && (
              <span
                style={{
                  ...noteReactionsStyles.regularCountText,
                  ...baseCountStyle,
                  right: "6px",
                }}
              >
                {regularCount}
              </span>
            )}
            {/* {superCount > 0 && (
              <span
                style={{
                  ...noteReactionsStyles.superCountText,
                  ...baseCountStyle,
                }}
              >
                {superCount}
              </span>
            )} */}
          </button>
        ))}
      </div>
    </div>
  );
}

// Common styles abstracted
const dividerStyle = {
  borderBottomWidth: "1px",
  borderColor: "lightgray",
  marginTop: "12px",
  marginBottom: "12px",
};

const containerStyle = {
  ...noteReactionsStyles.container,
  display: "flex",
  flexDirection: "row" as const,
  flexWrap: "wrap" as const,
};

const baseButtonStyle = {
  ...noteReactionsStyles.reactionButton,
  flexDirection: "row" as const,
  position: "relative" as const,
  padding: "4px 10px",
};

const emojiStyle = {
  fontSize: noteReactionsStyles.emojiText.fontSize,
};

const baseCountStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute" as const,
  textAlign: "center" as const,
};
