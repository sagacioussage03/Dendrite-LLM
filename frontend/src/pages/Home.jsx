import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import {
  getConversations,
  getConversation,
  createConversation,
  deleteConversation,
  sendMessage,
} from '../api/client';

/**
 * Home page — orchestrates sidebar, chat window, and input.
 */
export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState(null); // null = no conversation selected
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── Fetch conversation list ─────────────────────────── */
  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Unable to connect to backend. Is the server running?');
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  /* ── Select a conversation ───────────────────────────── */
  const handleSelect = useCallback(async (id) => {
    setActiveId(id);
    setError(null);
    try {
      const data = await getConversation(id);
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setMessages([]);
      setError('Failed to load conversation messages.');
    }
  }, []);

  /* ── Create new conversation ─────────────────────────── */
  const handleCreate = useCallback(async () => {
    setError(null);
    try {
      const conv = await createConversation();
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create conversation.');
    }
  }, []);

  /* ── Delete a conversation ───────────────────────────── */
  const handleDelete = useCallback(
    async (id) => {
      setError(null);
      try {
        await deleteConversation(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeId === id) {
          setActiveId(null);
          setMessages(null);
        }
      } catch (err) {
        console.error('Failed to delete conversation:', err);
        setError('Failed to delete conversation.');
      }
    },
    [activeId]
  );

  /* ── Send a message ──────────────────────────────────── */
  const handleSend = useCallback(
    async (prompt) => {
      if (!activeId) return;
      setError(null);
      setIsLoading(true);

      // Optimistic UI: show user message immediately
      const tempUserMsg = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      try {
        const data = await sendMessage(activeId, prompt);

        // Replace optimistic msg with real data and add assistant response
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          data.user_message,
          data.assistant_message,
        ]);

        // Refresh conversation list to update titles
        fetchConversations();
      } catch (err) {
        console.error('Chat error:', err);
        const errorDetail =
          err.response?.data?.detail || 'Something went wrong. Please try again.';

        // Remove optimistic message and show error as a system message
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          tempUserMsg,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ **Error:** ${errorDetail}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [activeId, fetchConversations]
  );

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
        }}
      >
        {/* Error banner */}
        {error && (
          <div
            style={{
              padding: '0.625rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ×
            </button>
          </div>
        )}

        <ChatWindow messages={messages} isLoading={isLoading} />

        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          disabled={!activeId}
        />
      </main>
    </div>
  );
}
