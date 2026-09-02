/**
 * localStorage key for the chat widget's persisted conversation history.
 * Split into its own module (rather than living in components/ChatWidget.tsx)
 * so anything that just needs to clear it on logout doesn't have to import
 * the whole chat widget component -- and with it, `ai/react` -- into every
 * page's client bundle.
 */
export const CHAT_HISTORY_KEY = "sa-kb-chat-history";
