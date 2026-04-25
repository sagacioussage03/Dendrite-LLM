import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  timeout: 120_000, // 2 min — LLM inference can be slow
  headers: { 'Content-Type': 'application/json' },
});

/* ── Conversations ──────────────────────────────────────── */

export const getConversations = () =>
  API.get('/conversations').then((r) => r.data);

export const getConversation = (id) =>
  API.get(`/conversations/${id}`).then((r) => r.data);

export const createConversation = (title = null) =>
  API.post('/conversations', { title }).then((r) => r.data);

export const deleteConversation = (id) =>
  API.delete(`/conversations/${id}`);

/* ── Chat ───────────────────────────────────────────────── */

export const sendMessage = (conversationId, prompt) =>
  API.post('/chat', { conversation_id: conversationId, prompt }).then(
    (r) => r.data
  );

export default API;
