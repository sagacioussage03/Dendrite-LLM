import { useState } from 'react';

/**
 * Chat input bar with send button.
 * Supports Enter to send, Shift+Enter for newline.
 */
export default function ChatInput({ onSend, isLoading, disabled }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.75rem',
          maxWidth: '900px',
          margin: '0 auto',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          padding: '0.5rem',
          transition: 'border-color var(--transition-fast)',
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)')
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = 'var(--glass-border)')
        }
      >
        <textarea
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Select or create a conversation…' : 'Type your message…'}
          disabled={disabled || isLoading}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9375rem',
            lineHeight: '1.5',
            padding: '0.5rem 0.75rem',
            maxHeight: '150px',
            overflowY: 'auto',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
          }}
        />

        <button
          id="send-button"
          onClick={handleSend}
          disabled={!input.trim() || isLoading || disabled}
          title="Send message"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background:
              input.trim() && !isLoading && !disabled
                ? 'var(--accent-gradient)'
                : 'var(--bg-surface-hover)',
            color:
              input.trim() && !isLoading && !disabled
                ? '#fff'
                : 'var(--text-muted)',
            cursor:
              input.trim() && !isLoading && !disabled
                ? 'pointer'
                : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
          }}
        >
          {isLoading ? (
            /* Spinner */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
            </svg>
          ) : (
            /* Send arrow */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          marginTop: '0.5rem',
        }}
      >
        Dendrite-LLM · Powered by Ollama · Enter to send, Shift+Enter for newline
      </p>
    </div>
  );
}
