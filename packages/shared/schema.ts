import {
  makeSchema,
  Schema,
  SessionIdSymbol,
  State,
} from "@livestore/livestore";

import { Filter } from "./types.ts";
import * as eventsDefs from "./events.ts";

const todos = State.SQLite.table({
  name: "todos",
  columns: {
    id: State.SQLite.text({ primaryKey: true }),
    text: State.SQLite.text({ default: "" }),
    completed: State.SQLite.boolean({ default: false }),
    deletedAt: State.SQLite.integer({
      nullable: true,
      schema: Schema.DateFromNumber,
    }),
    editing: State.SQLite.boolean({ default: false }),
  },
});

const note = State.SQLite.table({
  name: "note",
  columns: {
    id: State.SQLite.text({ primaryKey: true }),
    title: State.SQLite.text({ default: "" }),
    content: State.SQLite.text({ default: "" }),
    createdBy: State.SQLite.text({ default: "" }),
    createdAt: State.SQLite.integer({
      schema: Schema.DateFromNumber,
    }),
    deletedAt: State.SQLite.integer({
      nullable: true,
      schema: Schema.DateFromNumber,
    }),
  },
});

const reaction = State.SQLite.table({
  name: "reaction",
  columns: {
    id: State.SQLite.text({ primaryKey: true }),
    noteId: State.SQLite.text(),
    emoji: State.SQLite.text(),
    createdBy: State.SQLite.text({ default: "" }),
    createdAt: State.SQLite.integer({
      nullable: true,
      schema: Schema.DateFromNumber,
    }),
    deletedAt: State.SQLite.integer({
      nullable: true,
      schema: Schema.DateFromNumber,
    }),
    type: State.SQLite.text({
      schema: Schema.Literal("regular", "super"),
      default: "regular",
    }),
  },
  indexes: [
    {
      name: "note_id",
      columns: ["noteId"],
    },
  ],
});

const uiState = State.SQLite.clientDocument({
  name: "uiState",
  schema: Schema.Struct({ newTodoText: Schema.String, filter: Filter }),
  default: {
    id: SessionIdSymbol,
    value: { newTodoText: "", filter: "all" as Filter },
  },
});

export type Todo = State.SQLite.FromTable.RowDecoded<typeof todos>;
export type UiState = typeof uiState.default.value;
export type Note = State.SQLite.FromTable.RowDecoded<typeof note>;
export type Reaction = State.SQLite.FromTable.RowDecoded<typeof reaction>;

export const events = {
  ...eventsDefs,
  uiStateSet: uiState.set,
};

export const tables = { todos, uiState, note, reaction };

const materializers = State.SQLite.materializers(events, {
  "v1.TodoCreated": ({ id, text }) =>
    todos.insert({ id, text, completed: false }),
  "v1.TodoCompleted": ({ id }) =>
    todos.update({ completed: true }).where({ id }),
  "v1.TodoUncompleted": ({ id }) =>
    todos.update({ completed: false }).where({ id }),
  "v1.TodoDeleted": ({ id, deletedAt }) =>
    todos.update({ deletedAt }).where({ id }),
  "v1.TodoClearedCompleted": ({ deletedAt }) =>
    todos.update({ deletedAt }).where({ completed: true }),
  "v1.TodoEditingStarted": ({ id }) =>
    todos.update({ editing: true }).where({ id }),
  "v1.TodoEditingFinished": ({ id, text }) =>
    todos.update({ editing: false, text }).where({ id }),
  "v1.NoteCreated": ({ id, title, content, createdBy }) =>
    note.insert({ id, title, content, createdBy, createdAt: new Date() }),
  "v1.NoteTitleUpdated": ({ id, title }) =>
    note.update({ title }).where({ id }),
  "v1.NoteContentUpdated": ({ id, content }) =>
    note.update({ content }).where({ id }),
  "v1.NoteDeleted": ({ id, deletedAt }) =>
    note.update({ deletedAt }).where({ id }),
  "v1.NoteReacted": ({ id, noteId, emoji, createdBy }) =>
    reaction.insert({ id, noteId, emoji, createdBy }),
  "v1.NoteReactionDeleted": ({ id, deletedAt }) =>
    reaction.update({ deletedAt }).where({ id }),
  "v2.NoteReacted": ({ id, noteId, emoji, type, createdBy }) =>
    reaction.insert({
      id,
      noteId,
      emoji,
      type: type as "regular" | "super",
      createdBy,
      createdAt: new Date(),
    }),
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
