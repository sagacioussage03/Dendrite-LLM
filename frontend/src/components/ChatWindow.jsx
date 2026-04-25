import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

/**
 * Main chat area — displays messages and loading indicator.
 */
export default function ChatWindow({ messages, isLoading }) {
  const endRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!messages) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          🌿
        </div>
        <h2
          style={{
            fontSize: '1.375rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Welcome to Dendrite
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9375rem',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          Select a conversation from the sidebar or start a new one to begin chatting with your local AI.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {messages.length === 0 && (
          <div
            className="animate-fade-in"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--text-muted)',
              fontSize: '0.9375rem',
            }}
          >
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</p>
            <p>Start the conversation by typing a message below.</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px',
                background: 'var(--bg-ai-bubble)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                    animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
