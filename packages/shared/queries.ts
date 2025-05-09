import { queryDb, Schema, sql } from "@livestore/livestore";

import { tables } from "./schema.ts";

export const app$ = queryDb(tables.uiState.get(), { label: "app" });

export const visibleNotes$ = queryDb(
  tables.note
    .where({
      deletedAt: null,
    })
    .orderBy("createdAt", "desc"),
  { label: "visibleNotes" }
);

export const noteReactions$ = (noteId: string, type: "regular" | "super") =>
  queryDb(
    tables.reaction.where({
      noteId,
      type,
    }),
    { label: `reactions-${noteId}-${type}` }
  );

// returns rows like  { emoji: "🔥", count: 7 }
export const noteReactionCounts$ = (
  noteId: string,
  type: "regular" | "super"
) =>
  queryDb(
    {
      query: sql`
        SELECT emoji, COUNT(*) AS count
        FROM reaction
        WHERE noteId = ? AND type = ? AND deletedAt IS NULL
        GROUP BY emoji
      `,
      bindValues: [noteId, type],
      schema: Schema.Array(
        Schema.Struct({
          emoji: Schema.String,
          count: Schema.Number,
        })
      ),
    },
    { label: `reaction-counts-${noteId}-${type}`, deps: [noteId, type] }
  );
