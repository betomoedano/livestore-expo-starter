export const noteReactionsStyles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    paddingVertical: 12,
  },
  reactionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  superReactionButton: {
    backgroundColor: "#007AFF",
  },
  emojiText: {
    fontSize: 20,
    fontVariant: ["tabular-nums"],
  },
  countText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
    position: "absolute",
    backgroundColor: "#6b7280",
    borderWidth: 1,
    borderColor: "white",
    width: 25,
    minHeight: 20,
    borderRadius: 10,
    textAlign: "center",
  },
};
